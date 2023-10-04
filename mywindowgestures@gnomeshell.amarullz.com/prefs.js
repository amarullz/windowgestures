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

        this._win = window;
        let settings = window._settings = this.getSettings();

        // Gesture Settings
        this.gestures = new Adw.PreferencesGroup({ title: "Gestures" });

        this.gestures_noflip = new Adw.SwitchRow({
            title: "Keep System Gesture",
            subtitle: "If true, extension will not hook system gesture events but Use 3 Fingers config cannot be used. Need re-enable extension to take effect"
        });
        this.gestures.add(this.gestures_noflip);
        settings.bind("no-count-flip", this.gestures_noflip, 'active', Gio.SettingsBindFlags.DEFAULT);

        this.gestures_3fingers = new Adw.SwitchRow({
            title: "Use 3 Fingers",
            subtitle: "If true, window gestures will use three fingers, and workspace will use four finger"
        });
        this.gestures.add(this.gestures_3fingers);
        settings.bind("three-finger", this.gestures_3fingers, 'active', Gio.SettingsBindFlags.DEFAULT);


        // Size Settings
        this.tweaks = new Adw.PreferencesGroup({ title: "Tweaks" });

        this.field_edge_size = new Adw.SpinRow({
            title: "Edge Size for Resize",
            subtitle: "Number of pixel from window egdes to determine resize action",
            adjustment: new Gtk.Adjustment({
                lower: 16,
                upper: 96,
                step_increment: 4
            })
        });
        this.tweaks.add(this.field_edge_size);
        settings.bind("edge-size", this.field_edge_size, 'value', Gio.SettingsBindFlags.DEFAULT);


        this.field_topedge_size = new Adw.SpinRow({
            title: "Title Edge size",
            subtitle: "Number of pixel from top of window to determine move action",
            adjustment: new Gtk.Adjustment({
                lower: 16,
                upper: 96,
                step_increment: 4
            })
        });
        this.tweaks.add(this.field_topedge_size);
        settings.bind("top-edge-size", this.field_topedge_size, 'value', Gio.SettingsBindFlags.DEFAULT);


        this.field_threshold = new Adw.SpinRow({
            title: "Gesture Threshold",
            adjustment: new Gtk.Adjustment({
                lower: 16,
                upper: 64,
                step_increment: 4
            })
        });
        this.tweaks.add(this.field_threshold);
        settings.bind("gesture-threshold", this.field_threshold, 'value', Gio.SettingsBindFlags.DEFAULT);

        this.field_cancel_threshold = new Adw.SpinRow({
            title: "Gesture Cancel Threshold",
            adjustment: new Gtk.Adjustment({
                lower: 4,
                upper: 32,
                step_increment: 1
            })
        });
        this.tweaks.add(this.field_cancel_threshold);
        settings.bind("gesture-cancel-threshold", this.field_cancel_threshold, 'value', Gio.SettingsBindFlags.DEFAULT);

        this.field_accel = new Adw.SpinRow({
            title: "Gesture Acceleration",
            adjustment: new Gtk.Adjustment({
                lower: 10,
                upper: 25,
                step_increment: 1
            })
        });
        this.tweaks.add(this.field_accel);
        settings.bind("gesture-acceleration", this.field_accel, 'value', Gio.SettingsBindFlags.DEFAULT);

        // About
        this.about = new Adw.PreferencesGroup({ title: "About" });
        const aboutVersion = new Adw.ActionRow({
            title: 'My Window Gestures Version',
        });
        aboutVersion.add_suffix(new Gtk.Label({
            label: this.metadata.version.toString(),
            css_classes: ['dim-label'],
        }));
        this.about.add(aboutVersion);
        const githubRow = this._createLinkRow('Source Github', this.metadata.url);
        this.about.add(githubRow);
        const websiteRow = this._createLinkRow('Visit Website', WEBSITE_LINK);
        this.about.add(websiteRow);
        const donateRow = this._createLinkRow('Donate via PayPal', PAYPAL_LINK);
        this.about.add(donateRow);


        const page = new Adw.PreferencesPage();
        page.add(this.gestures);
        page.add(this.tweaks);
        page.add(this.about);
        window.add(page);
    }

    _createLinkRow(title_row, uri) {
        const image = new Gtk.Image({
            icon_name: 'adw-external-link-symbolic',
            valign: Gtk.Align.CENTER,
        });
        const linkRow = new Adw.ActionRow({
            title: title_row,
            activatable: true,
        });
        linkRow.connect('activated', () => {
            Gtk.show_uri(this._win, uri, Gdk.CURRENT_TIME);
        });
        linkRow.add_suffix(image);
        return linkRow;
    }
}