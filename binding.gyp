{
  'targets': [
    {
      'target_name': 'node-soxr',
      'sources': [
          'src/wrapper.cc',
          'soxr/src/cr.c',
          'soxr/src/cr32.c',
          'soxr/src/cr32s.c',
          'soxr/src/cr64.c',
          'soxr/src/data-io.c',
          'soxr/src/dbesi0.c',
          'soxr/src/fft4g32.c',
          'soxr/src/fft4g64.c',
          'soxr/src/filter.c',
          'soxr/src/pffft32s.c',
          'soxr/src/util32s.c',
          'soxr/src/soxr.c',
          'soxr/src/vr32.c',
        ],
      'include_dirs': ['soxr/config', 'soxr/src'],
      'dependencies': ["<!(node -p \"require('node-addon-api').targets\"):node_addon_api_except_all"],
      'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions' ],
      'xcode_settings': {
        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
        'CLANG_CXX_LIBRARY': 'libc++',
        'MACOSX_DEPLOYMENT_TARGET': '10.7'
      },
      'msvs_settings': {
        'VCCLCompilerTool': { 'ExceptionHandling': 1 },
      },
      'defines': ['SOXR_LIB', 'WITH_OPENMP'],
      'conditions': [
        ['OS=="mac"', {
          'cflags+': ['-fvisibility=hidden'],
          'xcode_settings': {
            'GCC_SYMBOLS_PRIVATE_EXTERN': 'YES', # -fvisibility=hidden
          }
        }]
      ]
    },
    {
        "target_name": "action-after-build",
        "type": "none",
        "dependencies": ["<(module_name)"],
        "copies": [
            {
                "files": ["<(PRODUCT_DIR)/<(module_name).node"],
                "destination": "<(module_path)"
            }
        ]
    }
  ]
}