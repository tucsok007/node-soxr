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
      'cflags!': [ '-fno-exceptions'],
      'cflags_cc!': [ '-fno-exceptions' ],
      'cflags+': ['-Wno-error=implicit-function-declaration', '-fopenmp', '-fopenmp-simd', '-pthread'],
      'cflags_cc+': ['-fopenmp', '-fopenmp-simd', '-pthread'],
      #'ldflags+': ['-fopenmp'],
      'xcode_settings': {
        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
        'CLANG_CXX_LIBRARY': 'libc++',
        'MACOSX_DEPLOYMENT_TARGET': '10.7'
      },
      'msvs_settings': {
        'VCCLCompilerTool': { 'ExceptionHandling': 1, 'AdditionalOptions' : ['/MT','/openmp:llvm'] },
      },
      'defines': ['SOXR_LIB', '_OPENMP'],
      'conditions': [
        ['OS=="mac"', {
          'cflags+': ['-fvisibility=hidden', '-Xpreprocessor'],
          'ldflags+': ["-lomp"],
          'libraries': ["-lomp"],
          'xcode_settings': {
            'GCC_SYMBOLS_PRIVATE_EXTERN': 'YES',
            'OTHER_CFLAGS': [ "-Xpreprocessor", "-fopenmp" ]
          }
        }],
        ['OS=="linux"', {
          'libraries': ["-lgomp"],
        }]
      ]
    }
  ]
}