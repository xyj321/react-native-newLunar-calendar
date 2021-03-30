### react-native-newLunar-calendar
fork原项目地址： https://npmjs.org/package/react-native-lunar-calendar

[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[snyk-image]: https://snyk.io/test/npm/react-native-lunar-calendar/badge.svg?style=flat-square
[snyk-url]: https://github.com/a728384698/react-native-newLunar-calendar.git
[download-image]: https://img.shields.io/npm/dm/react-native-lunar-calendar.svg?style=flat-square
[download-url]: https://github.com/a728384698/react-native-newLunar-calendar.git


### Getting Started

  ```shell
$ yarn add react-native-newLunar-calendar
  ```

```jsx
import Calender from "react-native-newLunar-calendar";

...
render() {
  return (
    <Calendar
        headerStyle={{backgroundColor: '#f00'}}
        weekHeadStyle={{backgroundColor: '#00f'}}
        onDateSelect={(date) => console.log(date)}
        onMonthSelect={(mon) => console.log(mon)}
        dateStyle={{backgroundColor: '#f0f'}}
        selectDateStyle={{backgroundColor: '#f00'}}
        weekendStyle={{backgroundColor: '#fff'}}
        style={{backgroundColor: '#0f0'}} />
  )
}
...
```

## API

* style

  | name            | type   | description                      |
  | --------------- | ------ | -------------------------------- |
  | style           | object | style of main page               |
  | weekHeadStyle   | object | style of head of week show       |
  | headerStyle     | object | style of head of year show       |
  | dateStyle       | object | date tab style                   |
  | selectDateStyle | object | style of date tab where selected |

* callback

  | name          | type                             | description                              |
  | ------------- | -------------------------------- | ---------------------------------------- |
  | onDateSelect  | callback function: (date) => {}  | the function will be called when select date on body |
  | onMonthSelect | callback function: (month) => {} | the function will be called when select date on header |

![](https://github.com/Txiaozhe/react-native-lunar-calendar/blob/master/image/calendar.png)

![](https://github.com/Txiaozhe/react-native-lunar-calendar/blob/master/image/calendar2.png)
