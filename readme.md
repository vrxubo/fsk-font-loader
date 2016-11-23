# fsk-font-loader #

## 安装 ##
>npm install fsk-font-loader

## 使用 ##

```
    {
      test: /xxx\.css$/, 字体样式存放的css文件
      loader: 'fsk-font', 
      query: {
        dir: '', // svg文件的目录  必填
        out: '', // 字体文件的输出目录   必填
        font: '', // 自定义字体名 选填，  默认： custom-font
        deep: '' // 是否遍历svg目录的子目录  选填， 默认false
      }
    }
```
