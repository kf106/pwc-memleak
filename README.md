# pwc-memleak

This repository should make it simpler to reproduce [pwc issue #333](https://github.com/PrismarineJS/prismarine-web-client/issues/333).

Clone the repo and then run ./install.sh to clone flying-squid and prismarine-web-client, and copy an intensive world generation function into flying-squid.

Then in one terminal, `cd flying-squid` and run `node fs.js`

In a second terminal, `cd prismarine-web-client` and run `npm start`

You should now be all set up to investigate.

# Entering the world

* Click Play on the main screen
* Enter 127.0.0.1 for the server IP, 20565 for the server port, keep proxy and port blank, put whatever username you like, and leave bot version blank
* Click connect. You should enter the world.

# Examining the memory usage

* In Chrome, hit F12 to open the developer tools 
* Along the top bar select Memory
* Make sure Heap snapshot is selected as the profiling type
* Click Take Snapshot at the bottom of the developer tools

Then move about a bit, and click on the grey circle at the top left of the developer tools (just next to the circle with the diagonal line).

Every time you move a bit you should see the next snapshot being substantially bigger than the next, and system/ JSArrayBufferData should be the cause.

If you look at an individual entry for JSArrayBufferData you should notice that they are all viewer related.

