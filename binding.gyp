{
  "targets": [
    {
      "target_name": "peek-orm",
      "sources": [
        "src/orm/index.c",
        "src/orm/math_functions.c",
        "src/orm/libraries/maths.c"
      ],
      "include_dirs": [
        "<!@(node -e \"require('node-addon-api').include\")"
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