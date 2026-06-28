# SH-PfP-NA

Lightweight, streaming-based userscript designed to resolve the ongoing North American CDN routing issues on SpaceHey.

## Installation
1. Ensure you have **Tampermonkey** installed. (There are other userscript managers, but this was written and tested in Tampermonkey: the following instructions thus only concretely apply to Tampermonkey.)
2. Disable all other extensions. (Optional, but I am not responsible for any conflicts or errors should you choose to skip this step.)
3. Ensure your browser has Developer Mode enabled for extensions.
4. In the Tampermonkey extension settings, ensure Allow User Scripts and Allow access to file URLs are ON.
5. Download the userscript .js file, or click [HERE](https://github.com/PavlovianCondition/SH-PfP-NA/raw/refs/heads/main/SH-PfP-NA-0.0.2.user.js) to install automatically through Tampermonkey.
6. Install and enable the userscript. If you downloaded the user.js file itself, simply create a new userscript in Tampermonkey and paste the contents of the user.js file, then hit CTRL + S to save.


## Scope & Coverage

This hotfix actively intercepts broken media assets and fixes them dynamically across the majority of the site architecture:
  * Home
  * Profile
  * Browse
  * Search
  * Instant Messenger
  * Blogs
  * Bulletins
  * Groups
  * Layouts
  * Favourites

Note:
1. I disclaim any errors arising from using this script when signed out of SpaceHey, or similarly in incognito mode. Testing is limited to early in development, and sparse.
2. Forum topics are currently excluded from this build and will be addressed in a subsequent release. Profiles using aggressive custom CSS layout overrides may lead to a rerouting failure, but the fix will still function everywhere else across the platform.

## License & Contributions
Copyright (c) 2026 Pavlovian Condition. All Rights Reserved.

This source code is proprietary. Unauthorized copying, redistribution, commercial use, or hosting of independent mirrors of this script are strictly prohibited. 

Permission is hereby granted solely for individuals to modify, edit, and experiment with the source code through the official GitHub fork-and-pull pipeline. All proposed modifications, bug fixes, or feature updates must be submitted directly to the official upstream repository (github.com/PavlovianCondition/SH-PfP-NA) as a Pull Request for review. Redistribution of modified versions outside of this specific repository is not permitted.
