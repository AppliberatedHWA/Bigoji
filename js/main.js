/**
 * Bigoji (https://github.com/AppliberatedHWA/bigoji)
 * Copyright (c) 2017 Appliberated (https://www.appliberated.com)
 * Licensed under MIT (https://github.com/AppliberatedHWA/bigoji/blob/master/LICENSE)
 */

/* global twemoji */

(function App() {

    "use strict";

    const DEFAULT_EMOJI = "😀";

    /**
     * Adds a leading number sign (#) if the string argument is a hex color value (eg F955AB).
     * @param {string} colorString A potentially hex color string.
     * @returns {string} The color string argument, #-prefixed if it contains a hex color value.
     */
    function ensureHexColorHash(colorString) {
        const hexColorRegex = /^([a-f0-9]{3,4}|[a-f0-9]{4}(?:[a-f0-9]{2}){1,2})\b$/i;
        return hexColorRegex.test(colorString) ? `#${colorString}` : colorString;
    }

    /**
     * Converts a string value to a 1 or 2 digit percent integer.
     * @param {string} value A string value to parse.
     * @returns {?number} An integer. If the string value cannot be converted, null is returned.
     */
    function parseIntPercent(value) {
        return (/^[1-9]?\d$/).test(value) ? parseInt(value, 10) : null;
    }

    /**
     * Toggles full screen mode.
     * @see {@link https://developers.google.com/web/fundamentals/native-hardware/fullscreen/}
     * @returns {void}
     */
    function toggleFullScreen() {
        const doc = window.document;
        const docEl = doc.documentElement;
        const requestFullScreen =
            docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        const exitFullscreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            requestFullScreen.call(docEl);
        } else {
            exitFullscreen.call(doc);
        }
    }

    /**
     * Parses the command line parameters from the location query string.
     * @returns {void}
     */
    function parseParams() {
        let backColor, emoji, size;

        const query = window.location.search.substring(1);

        // If we have parameters, parse them
        if (query.length) {

            const params = query.split("-");

            if (params[0]) {
                emoji = decodeURIComponent(params[0]);
            }

            if (params[1]) {
                backColor = ensureHexColorHash(params[1]);
            }
            if (params[2]) {
                size = parseIntPercent(params[2]);
            }
        }

        // Return the parameters
        return { backColor, emoji, size };
    }

    /**
     * Inits the main functionality of the app.
     * @returns {void}
     */
    function init() {

        const emojiWrapper = document.getElementById("emoji-wrapper");

        // Parse parameters
        const params = parseParams();

        // Parse the emoji string parameter and replace all emoji with a Twemoji SVG image
        if (params.emoji) {
            emojiWrapper.innerHTML = twemoji.parse(params.emoji, { ext: ".svg", folder: "svg" });
        }

        // If no emoji is in the string parameter, show the default emoji
        if (emojiWrapper.querySelectorAll(".emoji").length < 1) {
            emojiWrapper.innerHTML = twemoji.parse(DEFAULT_EMOJI, { ext: ".svg", folder: "svg" });
        }

        // Set the document title to a string of parsed emoji characters
        document.title = Array.from(emojiWrapper.querySelectorAll(".emoji"), item => item.alt).join("");

        // Apply the background color parameter; if it's an invalid color value, the white default value is preserved
        if (params.backColor) {
            document.body.style.backgroundColor = params.backColor;
        }

        // Apply the size parameter to the max-width and max-height of the emoji image(s) by inserting a new CSS rule
        if (params.size) {
            const sheet = document.head.appendChild(document.createElement('style')).sheet;
            const rule = `.emoji { max-width: ${params.size}%; max-height: ${params.size}%; }`;
            sheet.insertRule(rule, 0);
        }

        // Toggle full screen mode on double click
        emojiWrapper.addEventListener("dblclick", toggleFullScreen);
    }

    init();

}());
