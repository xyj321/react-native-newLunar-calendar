/*
 * MIT License
 *
 * Copyright (c) 2017 Tang Xiaozhe.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict'

import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  DeviceEventEmitter,
} from 'react-native'

import getLunarDate from './getLunarDate'
import { Style, Color } from '../res'
import Tip from '../../../scripts/util/tips'

export default class CalendarBody extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isClick:false //防止多次点击
    }
  }

  getFirstDay = (year, month) => {
  
    let weekDays = ['周日','周1','周2','周3','周4','周5','周6'];
    let day = new Date(year, month - 1, 1).getDay();
    let weekDay = weekDays[day];
    return day
  }

  getMonthLen = (year, month) => {
    let nextMonth = new Date(year, month, 1)
    nextMonth.setHours(nextMonth.getHours() - 3)
    return nextMonth.getDate()
  }

  getCalendarTable = (year, month) => {
    let monthLen = this.getMonthLen(year, month)
    let firstDay = this.getFirstDay(year, month)
    let list = [[]]
    let i, cur, row, col
      for (i = firstDay; i--; ) {
        list[0].push('')
      }
      for (i = 1; i <= monthLen; i++) {
        cur = i + firstDay - 1
        row = Math.floor(cur / 7)
        col = cur % 7
        list[row] = list[row] || []
        list[row].push(i)
      }
      let lastRow = list[row]
      // let remain = 7 - list[row].length
   
      for (i = 7 - lastRow.length; i--; ) {
        lastRow.push('')
      }
      return list
   
    
 
  }

  onClickCallback = (year, month, day, selectAction) => {
    let new_date = year + '-' + month + '-' + day
    this.props.onSelectedChange(
      new_date,
      new Date(year, month - 1, day),
      selectAction
    )
  }
  componentDidMount() {
    let date = this.props.date
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    this.updateCalendar(year + '-' + month + '-' + day)
    this.subSc = DeviceEventEmitter.addListener('UpdateCalendar', (data) =>
      this.updateCalendar(data.date)
    )
   
  }

  componentWillUnmount () {
    this.subSc && this.subSc.remove()
  }

  updateCalendar (forkDate = '') {
   
    let userDate = forkDate
    this.getBaiduMonthCalendarBody(userDate, (almanac_data) => {
      this.almanac_data = almanac_data
      this.setState({
        isClick:true
      })
    })
  }

  render() {
    let date = this.props.date
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()

    let curDate = this.props.current
    let curYear = curDate.getFullYear()
    let curMonth = curDate.getMonth() + 1
    let curDay = curDate.getDate()
    let cur = {
      backgroundColor: '#6A9983',
    }
    let mb_arr = []
    this.almanac_data &&
      this.almanac_data.map((info, index) => {
        if (info.suit.includes('修造')|| info.suit.includes('上梁')) {
          mb_arr.push({ suit: info.suit, day: index + 1, avoid: info.avoid })
        }
      })
    let table = this.getCalendarTable(year, month)
    let rows = table.map((row, rowId) => {
      if (!row) {
        return Tip.ShowInfo('数据获取失败')
      }
      let days = row.map((day, index) => {
        let isCur = year === curYear && month === curMonth && day === curDay
        let isWeekend = index === 0 || index === 6
        let lunarDate
        let lunarDateView
        let pressCb = isCur
          ? () => {}
          : () => {
            if (day) {
              try {
                  this.props.callBackData( this.almanac_data[day - 1])
                  this.onClickCallback(year, month, day)
          
               } catch{
                this.props.failClickBack()
              }
            }
        
            }
        let className = [
          styles.day,
          styles.center,
          styles.date,
          this.props.dateStyle,
        ]
        if (isWeekend)
          className.push(
            this.props.weekendStyle ? this.props.weekendStyle : styles.weekend
          )
        mb_arr &&
          mb_arr.map((info, idx) => {
            if (info.day == day) {
              className.push(this.props.almanacDefalutColor)
            }
          })
        if (isCur)
          className.push(
            this.props.selectDateStyle ? this.props.selectDateStyle : cur
          )
        if (day) {
          lunarDate = getLunarDate(new Date(year, month - 1, day))
          lunarDateView = (
            <View>
              <Text style={styles.lunar}>
                {lunarDate.day == '初一'
                  ? lunarDate.month + '月'
                  : lunarDate.day}
              </Text>
            </View>
          )
        }

        return (
          <TouchableOpacity key={index} style={[className]} onPress={pressCb}>
            <Text>{day}</Text>
            {lunarDateView}
          </TouchableOpacity>
        )
      })
      return (
        <View key={rowId} style={[styles.row]}>
          <View style={styles.row}>{days}</View>
        </View>
      )
    })
    return (
      <View style={[styles.rows]}>
        <View>{rows}</View>
      </View>
    )
  }
  getBaiduMonthCalendarBody (date, callback) {
    if (this.state.isClick == false) {
      let url_baidu =
      'http://opendata.baidu.com/api.php?query=' +
      date +
      '&resource_id=6018&format=json'
      var request = new XMLHttpRequest()
      
 
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return
      }

      if (request.status === 200) {
        try { 
          let json_data = JSON.parse(request.responseText) //转json
          let almanac_data = json_data.data[0].almanac
  
          callback(almanac_data)
        } catch{
          // 数据解析失败，重新请求解析
          DeviceEventEmitter.emit('UpdateCalendar', { date })
        }
       
      } else {
      
        // alert('请求失败！')
      }
    }
    request.open('GET', url_baidu)
    request.send()
    }
  }
}

const styles = StyleSheet.create({
  text_center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
  },

  date: {
    width: Style.WidthScale(7),
    height: Style.WidthScale(7),
  },

  center: {
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },

  react_calendar: {
    width: Style.WIDTH,
    height: Style.HEIGHT,
  },

  weekend: {
    // backgroundColor: "#f00"
  },

  lunar: {
    color: Color.black,
    fontSize: 10,
  },

  day: {
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },

  header: {
    backgroundColor: Color.white,
  },
})
