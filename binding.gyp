{
  "targets": [
    {
      "target_name": "peek-orm",
      "sources": [
        "src/orm/index.c",
        "src/orm/math_functions.c",
        "src/orm/mysql_functions.c",
        "src/orm/libraries/maths.c",
        "src/orm/libraries/mysql_lib.c"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "/usr/local/mysql-8.2.0-macos13-arm64/include",
      ],
      "libraries": [
        "-lmysqlclient"
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "xcode_settings": {
        "GCC_ENABLE_CPP_EXCEPTIONS": "YES"
      }
    }
  ]
}