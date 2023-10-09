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

        let settings = this.getSettings();

        // Gesture Settings
        let gestures = new Adw.PreferencesGroup({ title: "Gestures" });

        let gestures_noflip = new Adw.SwitchRow({
            title: "Keep System Gesture",
            subtitle: "If true, extension will not hook system gesture events but Use 3 Fingers config cannot be used. Need re-enable extension to take effect"
        });
        gestures.add(gestures_noflip);
        settings.bind("no-count-flip", gestures_noflip, 'active', Gio.SettingsBindFlags.DEFAULT);

        let gestures_3fingers = new Adw.SwitchRow({
            title: "Use 3 Fingers",
            subtitle: "If true, window gestures will use three fingers, and workspace will use four finger"
        });
        gestures.add(gestures_3fingers);
        settings.bind("three-finger", gestures_3fingers, 'active', Gio.SettingsBindFlags.DEFAULT);

        let gestures_hswitch = new Adw.SwitchRow({
            title: "Horizontal Swipe Always Switch Windows",
            subtitle: "If true, Horizontal swipe will always switching windows just like swiping outside window area"
        });
        gestures.add(gestures_hswitch);
        settings.bind("horiz-swap-switch", gestures_hswitch, 'active', Gio.SettingsBindFlags.DEFAULT);


        // Size Settings
        let tweaks = new Adw.PreferencesGroup({ title: "Tweaks" });

        let field_edge_size = new Adw.SpinRow({
            title: "Edge Size for Resize",
            subtitle: "Number of pixel from window egdes to determine resize action",
            adjustment: new Gtk.Adjustment({
                lower: 16,
                upper: 96,
                step_increment: 4
            })
        });
        tweaks.add(field_edge_size);
        settings.bind("edge-size", field_edge_size, 'value', Gio.SettingsBindFlags.DEFAULT);


        let field_topedge_size = new Adw.SpinRow({
            title: "Title Edge size",
            subtitle: "Number of pixel from top of window to determine move action",
            adjustment: new Gtk.Adjustment({
                lower: 16,
                upper: 96,
                step_increment: 4
            })
        });
        tweaks.add(field_topedge_size);
        settings.bind("top-edge-size", field_topedge_size, 'value', Gio.SettingsBindFlags.DEFAULT);


        let field_threshold = new Adw.SpinRow({
            title: "Gesture Threshold",
            adjustment: new Gtk.Adjustment({
                lower: 16,
                upper: 64,
                step_increment: 4
            })
        });
        tweaks.add(field_threshold);
        settings.bind("gesture-threshold", field_threshold, 'value', Gio.SettingsBindFlags.DEFAULT);

        let field_cancel_threshold = new Adw.SpinRow({
            title: "Gesture Cancel Threshold",
            adjustment: new Gtk.Adjustment({
                lower: 4,
                upper: 32,
                step_increment: 1
            })
        });
        tweaks.add(field_cancel_threshold);
        settings.bind("gesture-cancel-threshold", field_cancel_threshold, 'value', Gio.SettingsBindFlags.DEFAULT);

        let field_accel = new Adw.SpinRow({
            title: "Gesture Acceleration",
            adjustment: new Gtk.Adjustment({
                lower: 10,
                upper: 25,
                step_increment: 1
            })
        });
        tweaks.add(field_accel);
        settings.bind("gesture-acceleration", field_accel, 'value', Gio.SettingsBindFlags.DEFAULT);

        // About
        let about = new Adw.PreferencesGroup({ title: "About" });
        let aboutVersion = new Adw.ActionRow({
            title: 'Window Gestures Version',
        });
        aboutVersion.add_suffix(new Gtk.Label({
            label: this.metadata.version.toString(),
            css_classes: ['dim-label'],
        }));
        about.add(aboutVersion);
        let githubRow = this._createLinkRow(window, 'Source Github', this.metadata.url);
        about.add(githubRow);
        let websiteRow = this._createLinkRow(window, 'Visit Website', WEBSITE_LINK);
        about.add(websiteRow);
        let donateRow = this._createLinkRow(window, 'Donate via PayPal', PAYPAL_LINK);
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
        page.add(tweaks);
        page.add(about);
        page.add(gnuSoftwareGroup);
        window.add(page);
    }

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