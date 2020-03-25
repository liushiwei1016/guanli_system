import {$axios} from "../axios";

/**
 * 左侧菜单列表数据的请求
 * */
export function getNavMenuData() {
  return $axios({
    url: '/menus',
    methods: 'get'
  })
}
