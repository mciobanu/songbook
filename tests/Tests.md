## Notes

Not sure what the best approach is. Chose to install Mocha, as that was used in 
an example. However, it looks like Jest was already configured to some extent. At least
when you run a test in the IDE for the first time, you get to choose if you want 
Mocha (an "M" icon) or Jest (a jester's shoe). However, by default neither work. There 
are errors like `TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for ...`
or other types. Some research led to:
 * [Mocha does not work with typescript when compilerOptions.module set to esnext](https://github.com/mochajs/mocha/issues/4919)
 * [Overriding `tsconfig.json` for ts-node in mocha](https://stackoverflow.com/questions/40635956/overriding-tsconfig-json-for-ts-node-in-mocha#comment103202638_44343768)

The issue is that React uses **esnext** modules, while Mocha uses **commonjs**. Somehow 
unexpectedly, the "solution" seems to be to tell Mocha to use **commonjs** in a
separate file than the regular **tsconfig.json**, which is done here in
**tsconfig.mocha.json**.

Then, **package.json** also had to be changed, both to add Mocha-related packages
and to change the **test** script to call Mocha, including to use **tsconfig.mocha.json**.

### Debugging
Seems to work fine. The main things to do:
 * Choose the **M**, when pressing the arrow to debug a new function
 * Go to the run configuration and add `TS_NODE_PROJECT=./tsconfig.mocha.json` 
    as the environment variable

### What tests you can run
 * Individual functions (from the editor)
 * Test suites (groups in a file)
 * Test files (starting them from the left panel doesn't work, because that uses Jest,
   but, you can create a Mocha configuration manually)
 * Supposedly all tests in a dir, but couldn't get it to work (probably because of some 
    naming convention)
 * File patterns, which work, and can be used to achieve "all in a dir". Example:
    `tests/**/*.test.ts`
 * Everything under **scripts/test** in **package.json**, by clicking on the corresponding
    arrow in **package.json**

### Running things manually:
```
TS_NODE_PROJECT=./tsconfig.mocha.json \ 
/usr/bin/node node_modules/mocha/bin/mocha.js \ 
--require ts-node/register \ 
tests/TestRange.test.ts
```

### Installing packages
`npm install chai @types/chai mocha @types/mocha ts-node --save-dev`
