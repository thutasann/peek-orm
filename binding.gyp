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
        "<!@(node -e \"require('node-addon-api').include\")",
        "/usr/local/mysql/include",         # Alternate MySQL include path
      ],
      "cflags!": ["-fno-exceptions"],
      "cflags": [
        "-std=c11",
        "-Os",
        "-ffunction-sections",
        "-fdata-sections",
        "-flto"
      ],
      "ldflags": [
        "-Wl,--gc-sections",
        "-Wl,--strip-all",
        "-s",
        "-flto"
      ]
    }
  ]
}