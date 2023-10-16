/* prefs.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';
import Gdk from 'gi://Gdk';
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const WEBSITE_LINK = "https://amarullz.com/";
        const PAYPAL_LINK = "https://paypal.me/amarullz";
        const GNU_SOFTWARE = '<span size="small">' +
            'This program comes with absolutely no warranty.\n' +
            'See the <a href="https://gnu.org/licenses/old-licenses/gpl-2.0.html">' +
            'GNU General Public License, version 2 or later</a> for details.' +
            '</span>';
        let isSwap = this.getSettings().get_boolean('three-finger');

        // Gesture Settings
        const gestures = new Adw.PreferencesGroup({ title: "Gestures" });
        this._createSwitch(
            gestures, "three-finger",
            "Switch 3 and 4 fingers",
            ""
        );
        this._createSwitch(
            gestures, "use-active-window",
            "Use active window",
            "If true, gesture will control active window rather than window on current pointer. This will disable resize function"
        );
        this._createSwitch(
            gestures, "taphold-move",
            "Tap and hold to move/resize window",
            "Trigger move window by tap and hold rather than by swipe down"
        );


        // Function Settings
        const fn = new Adw.PreferencesGroup({ title: "Active Functions" });
        this._createSwitch(
            fn, "pinch-enable",
            "Enable pinch gestures",
            ""
        );
        this._createSwitch(
            fn, "fn-resize",
            "Enable resize window",
            ""
        );
        this._createSwitch(
            fn, "fn-move",
            "Enable move window",
            ""
        );
        this._createSwitch(
            fn, "fn-fullscreen",
            "Enable fullscreen",
            ""
        );
        this._createSwitch(
            fn, "fn-maximized-snap",
            "Enable maximized window snap",
            ""
        );
        this._createSwitch(
            fn, "fn-move-snap",
            "Enable move window snap",
            ""
        );

        // Pinch Settings
        const action_list = [
            "Disable",
            "Minimize window",      // 1
            "Close window",         // 2
            "Show desktop",         // 3

            "Next window",          // 4
            "Previous window",      // 5

            "Send window left",     // 6
            "Send window right",    // 7

            "Back",                 // 8
            "Forward",              // 9
            "Brightness up",        // 10
            "Brightness down",      // 11
            "Volume up",            // 12
            "Volume down",          // 13
            "Mute",                 // 14
            "Media play",           // 15
            "Media next",           // 16
            "Media previous",       // 17

            "Alt+Tab switch",       // 18
            "Overview",             // 19
            "Application Grid",     // 20
            "Quick settings",       // 21
            "Notification",         // 22
            "Run (Alt+F2)",         // 23

        ];

        const act1 = new Adw.PreferencesGroup({
            title: (isSwap ? "3" : "4") + " Fingers Actions"
        });
        this._createCombo(act1, "swipe4-left",
            "Swipe left", "", action_list);
        this._createCombo(act1, "swipe4-right",
            "Swipe right", "", action_list);
        this._createCombo(act1, "swipe4-updown",
            "Swipe down",
            "Swipe up > down if Tap and hold to move/resize window disabled",
            action_list);

        const act2 = new Adw.PreferencesGroup({
            title: (isSwap ? "4" : "3") + " Fingers Actions"
        });
        this._createCombo(act2, "swipe3-down",
            "Swipe down", "", action_list);
        this._createCombo(act2, "swipe3-left",
            "Swipe down > left", "", action_list);
        this._createCombo(act2, "swipe3-right",
            "Swipe down > right", "", action_list);
        this._createCombo(act2, "swipe3-downup",
            "Swipe down > up", "", action_list);

        const act3 = new Adw.PreferencesGroup({ title: "Pinch Actions" });
        this._createCombo(act3, "pinch3-in",
            "Pinch-in 3 fingers", "", action_list);
        this._createCombo(act3, "pinch3-out",
            "Pinch-out 3 fingers", "", action_list);
        this._createCombo(act3, "pinch4-in",
            "Pinch-in 4 fingers", "", action_list);
        this._createCombo(act3, "pinch4-out",
            "Pinch-out 4 fingers", "", action_list);


        // Tweaks Settings
        const tweaks = new Adw.PreferencesGroup({ title: "Tweaks" });
        this._createSpin(tweaks, "edge-size",
            "Resize edge size",
            "Number of pixel from window egdes to determine resize action",
            16, 96, 4);
        this._createSpin(tweaks, "top-edge-size",
            "Title edge size",
            "Number of pixel from top of window to determine move action",
            16, 96, 4);
        this._createSpin(tweaks, "gesture-threshold",
            "Gesture threshold",
            "",
            16, 64, 4);
        this._createSpin(tweaks, "gesture-cancel-threshold",
            "Gesture cancel threshold",
            "",
            4, 32, 1);
        this._createSpin(tweaks, "gesture-acceleration",
            "Gesture acceleration",
            "",
            10, 25, 1);
        this._createSpin(tweaks, "pinch-in-scale",
            "Pinch in scale target",
            "",
            30, 80, 5);
        this._createSpin(tweaks, "pinch-out-scale",
            "Pinch out scale target",
            "",
            120, 200, 5);


        // About
        const about = new Adw.PreferencesGroup({ title: "About" });
        const aboutVersion = new Adw.ActionRow({
            title: 'Window Gestures Version',
        });
        aboutVersion.add_suffix(new Gtk.Label({
            label: this.metadata.version.toString(),
            css_classes: ['dim-label'],
        }));
        about.add(aboutVersion);
        const githubRow = this._createLinkRow(window, 'Source Github', this.metadata.url);
        about.add(githubRow);
        const websiteRow = this._createLinkRow(window, 'Visit Website', WEBSITE_LINK);
        about.add(websiteRow);
        const donateRow = this._createLinkRow(window, 'Donate via PayPal', PAYPAL_LINK);
        about.add(donateRow);

        // GNU
        const gnuSoftwareGroup = new Adw.PreferencesGroup();
        const gnuSofwareLabel = new Gtk.Label({
            label: GNU_SOFTWARE,
            use_markup: true,
            justify: Gtk.Justification.CENTER,
        });
        const gnuSofwareLabelBox = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            valign: Gtk.Align.END,
            vexpand: true,
        });
        gnuSofwareLabelBox.append(gnuSofwareLabel);
        gnuSoftwareGroup.add(gnuSofwareLabelBox);

        const page = new Adw.PreferencesPage();
        page.add(gestures);
        page.add(act1);
        page.add(act2);
        page.add(act3);
        page.add(fn);
        page.add(tweaks);
        page.add(about);
        page.add(gnuSoftwareGroup);
        window.add(page);
    }

    /* Create Switch Config */
    _createSwitch(parent, bind, title, subtitle) {
        const el = new Adw.SwitchRow({
            title: title,
            subtitle: subtitle
        });
        parent.add(el);
        this.getSettings().bind(
            bind, el, 'active', Gio.SettingsBindFlags.DEFAULT);
    }

    /* Create Switch Config */
    _createSpin(parent, bind, title, subtitle, min, max, inc) {
        const el = new Adw.SpinRow({
            title: title,
            subtitle: subtitle,
            adjustment: new Gtk.Adjustment({
                lower: min,
                upper: max,
                step_increment: inc
            })
        });
        parent.add(el);
        this.getSettings().bind(
            bind, el, 'value', Gio.SettingsBindFlags.DEFAULT);
    }

    /* Create Combo Row */
    _createCombo(parent, bind, title, subtitle, items) {
        const itemStr = new Gtk.StringList();
        for (var i = 0; i < items.length; i++) {
            itemStr.append(items[i]);
        }
        const comboRow = new Adw.ComboRow({
            title: title,
            subtitle: subtitle,
            model: itemStr,
            selected: this.getSettings().get_int(bind),
        });
        comboRow.connect('notify::selected', widget => {
            this.getSettings().set_int(bind, widget.selected);
        });
        parent.add(comboRow);
    }

    /* Create Link */
    _createLinkRow(window, title_row, uri) {
        const image = new Gtk.Image({
            icon_name: 'adw-external-link-symbolic',
            valign: Gtk.Align.CENTER,
        });
        const linkRow = new Adw.ActionRow({
            title: title_row,
            activatable: true,
        });
        linkRow.connect('activated', () => {
            Gtk.show_uri(window, uri, Gdk.CURRENT_TIME);
        });
        linkRow.add_suffix(image);
        return linkRow;
    }
}