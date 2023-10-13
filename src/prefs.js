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

        // Gesture Settings
        const gestures = new Adw.PreferencesGroup({ title: "Gestures" });
        this._createSwitch(
            gestures, "three-finger",
            "Use 3 Fingers",
            "If true, window gestures will use three fingers, and workspace will use four finger"
        );
        this._createSwitch(
            gestures, "horiz-swap-switch",
            "Horizontal Swipe Always Switch Windows",
            "If true, Horizontal swipe will always switching windows just like swiping outside window area",
        );
        this._createSwitch(
            gestures, "use-active-window",
            "Handle Active Window",
            "If true, gesture will control active window rather than window on current pointer. This will disable resize function"
        );

        // Function Settings
        const fn = new Adw.PreferencesGroup({ title: "Functions" });
        this._createSwitch(
            fn, "fn-resize",
            "Enable Resize",
            "Enable resize window if cursor on resize edges"
        );
        this._createSwitch(
            fn, "fn-move",
            "Enable Move",
            "Enable move function"
        );
        this._createSwitch(
            fn, "fn-fullscreen",
            "Enable Fullscreen",
            "Enable fullscreen function"
        );
        this._createSwitch(
            fn, "fn-maximized-snap",
            "Enable Maximized Snap",
            "Enable swipe up then left/right gesture to maximized to side"
        );
        this._createSwitch(
            fn, "fn-move-snap",
            "Enable Move Snap",
            "Enable snapping window when moving"
        );

        // Pinch Settings
        const pinch_actions = [
            "Disable",
            "Minimize Window",
            "Close Window",
            "Show Desktop",
            "Next Window",
            "Previous Window",
            "Back",
            "Forward",
            "Volume Up",
            "Volume Down",
            "Mute",
            "Brightness Up",
            "Brightness Down",

            "Alt+Tab Switch",
            "Overview (Super)",
            "App (Super+A)",
            "Quick Settings",
            "Notification",
            "Run (Alt+F2)",

        ];
        const pinch = new Adw.PreferencesGroup({ title: "Pinch" });
        this._createSwitch(
            pinch, "pinch-enable",
            "Enable Pinch",
            "Enable pinch tracking"
        );
        this._createCombo(pinch, "pinch3-in",
            "Pinch-In 3 Fingers", "", pinch_actions);
        this._createCombo(pinch, "pinch3-out",
            "Pinch-Out 3 Fingers", "", pinch_actions);
        this._createCombo(pinch, "pinch4-in",
            "Pinch-In 4 Fingers", "", pinch_actions);
        this._createCombo(pinch, "pinch4-out",
            "Pinch-Out 4 Fingers", "", pinch_actions);

        this._createSpin(pinch, "pinch-in-scale",
            "Pinch-In Trigger Scale Perentage",
            "Trigger pinch-in if pinch scale lower than this value",
            30, 80, 5);
        this._createSpin(pinch, "pinch-out-scale",
            "Pinch-Out Trigger Scale Perentage",
            "Trigger pinch-out if pinch scale bigger than this value",
            120, 200, 5);


        // Tweaks Settings
        const tweaks = new Adw.PreferencesGroup({ title: "Tweaks" });
        this._createSpin(tweaks, "edge-size",
            "Edge Size for Resize",
            "Number of pixel from window egdes to determine resize action",
            16, 96, 4);

        this._createSpin(tweaks, "top-edge-size",
            "Title Edge size",
            "Number of pixel from top of window to determine move action",
            16, 96, 4);

        this._createSpin(tweaks, "gesture-threshold",
            "Gesture Threshold",
            "",
            16, 64, 4);

        this._createSpin(tweaks, "gesture-cancel-threshold",
            "Gesture Cancel Threshold",
            "",
            4, 32, 1);

        this._createSpin(tweaks, "gesture-acceleration",
            "Gesture Acceleration",
            "",
            10, 25, 1);


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
        page.add(fn);
        page.add(pinch);
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