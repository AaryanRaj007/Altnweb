/**
 * Central place for the handful of project-specific URLs the site links to.
 */

/** The app's source repository. Header GitHub icon and issue links point here. */
export const GITHUB_OWNER = "AaryanRaj007";
export const GITHUB_REPO = "SaySo";

export const GITHUB_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;

/**
 * Where the released .dmg lives. Kept separate from the source repo because the
 * plan is to publish builds from the (not yet created) website repo.
 *
 * TODO(aaryan): once the website repo exists, set RELEASES_REPO to its name.
 * Until then this points at the app repo, so download links resolve to
 * github.com/AaryanRaj007/SaySo/releases.
 */
export const RELEASES_OWNER = GITHUB_OWNER;
export const RELEASES_REPO = GITHUB_REPO;

export const RELEASES_URL = `https://github.com/${RELEASES_OWNER}/${RELEASES_REPO}`;

export const SITE_NAME = "SaySo";
export const STUDIO_NAME = "altn";

/** The project SaySo is forked from. Kept for MIT attribution. */
export const UPSTREAM_NAME = "Handy";
export const UPSTREAM_URL = "https://github.com/cjpais/Handy";
