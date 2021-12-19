// Custom Javascript build script to use esbuild plugins with phoenix
const path = require('path');
const esbuild = require('esbuild');
const copy = require('esbuild-plugin-copy').default;
const args = process.argv.slice(2);
const watch = args.includes('--watch');
const deploy = args.includes('--deploy');

const loader = {
  // Add loaders for images/fonts/etc, e.g. { '.svg': 'file' }
  '.png': 'file',
  '.jpg': 'file',
  '.ttf': 'file'
};

const plugins = [
  // Add and configure plugins here
  // Custom copy plugin for esbuild(https://nx-plugins.netlify.app/derived/esbuild.html#copy)
  // These paths are relative to "priv/static" since thats set as the outdir
  copy({
    assets: [
      {
        from: './manifest.json',
        to: '../.' // "priv/static/manifest.json"
      },
      {
        from: './icons/*',
        to: '../icons',
      },
      {
        from: './screenshots/*',
        to: '../screenshots'
      }
    ]
  }),
];

let opts = {
  entryPoints: ['js/index.tsx', 'js/service-worker.ts'],
  bundle: true,
  target: 'es2016',
  outdir: '../priv/static/assets',
  logLevel: 'info',
  loader,
  plugins
};

if (watch) {
  opts = {
    ...opts,
    watch,
    sourcemap: 'inline'
  };
}

if (deploy) {
  opts = {
    ...opts,
    minify: true
  };
}

const promise = esbuild.build(opts);

if (watch) {
  promise.then(_result => {
    process.stdin.on('close', () => {
      process.exit(0);
    })

    process.stdin.resume();
  })
}
