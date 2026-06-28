# SH-PfP-NA

Lightweight, streaming-based userscript designed to resolve the ongoing North American CDN routing issues on SpaceHey.

## Installation
1. Ensure you have **Tampermonkey** installed. (There are other userscript managers, but this was written and tested in Tampermonkey: the following instructions thus only concretely apply to Tampermonkey.)
2. Disable all other extensions. (Optional, but I am not responsible for any conflicts or errors should you choose to skip this step.)
3. Ensure your browser has Developer Mode enabled for extensions.
4. In the Tampermonkey extension settings, ensure Allow User Scripts and Allow access to file URLs are ON.
5. Download the userscript .js file.
6. Install and enable the userscript.


## Scope & Coverage

This hotfix actively intercepts broken media assets and fixes them dynamically across the majority of the site architecture:


**Note:
1. I disclaim any errors arising from using this script when signed out of SpaceHey, or similarly in incognito mode. Testing is limited to early in development, and sparse.
2. Forum topics are currently excluded from this build and will be addressed in a subsequent release. Profiles using aggressive custom CSS layout overrides may lead to a rerouting failure, but the fix will still function everywhere else across the platform.**

## License & Contributions

