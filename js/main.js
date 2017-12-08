/*global twemoji*/

"use strict";

(function App() {

    const DEFAULT_EMOJI = "😀";

    function ensureHexColorHash(hex) {
        const hexColorRegex = /^([a-f0-9]{3,4}|[a-f0-9]{4}(?:[a-f0-9]{2}){1,2})\b$/i;
        return hexColorRegex.test(hex) ? "#" + hex : hex;
    }

    function parseIntPercent(value) {
        return /^[1-9]?\d$/.test(value) ? parseInt(value, 10) : null;
    }

    function parseParams() {
        let emoji, backColor, size;

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
        return { emoji, backColor, size };
    }

    function init() {

        // Parse parameters
        const params = parseParams();

        const emojiWrapper = document.getElementById("emoji-wrapper");

        if (params.emoji) {
            // Parse the emoji string parameter and replace all emoji with a Twemoji SVG image
            emojiWrapper.innerHTML = twemoji.parse(params.emoji, { folder: "svg", ext: ".svg" });
        }

        // If no emoji is in the string parameter, show the default emoji
        if (emojiWrapper.querySelectorAll(".emoji").length < 1) {
            emojiWrapper.innerHTML = twemoji.parse(DEFAULT_EMOJI, { folder: "svg", ext: ".svg" });
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
    }

    init();

}());
