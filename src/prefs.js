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
import { PACKAGE_VERSION } from 'resource:///org/gnome/Shell/Extensions/js/misc/config.js';

export default class extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const DONATION_URL = 'https://ko-fi.com/vanceral';
        const ORIGINAL_PROJECT_URL = 'https://github.com/amarullz/windowgestures';
        const GNU_SOFTWARE = '<span size="small">' +
            '本程序不提供任何担保。\n' +
            '详情请参阅 <a href="https://gnu.org/licenses/old-licenses/gpl-2.0.html">' +
            'GNU 通用公共许可证第 2 版或更高版本</a>。' +
            '</span>';
        let isSwap = this.getSettings().get_boolean('three-finger');

        // Support
        const support = new Adw.PreferencesGroup({
            title: "表达谢意"
        });
        const supportRow = new Adw.ActionRow({
            title: "用 Ko-fi 请作者喝杯咖啡",
            subtitle: "适配 GNOME 51 花了很多时间做调研和调试。如果这个扩展对你有帮助，小额赞助是表达谢意的好方式。",
            activatable: Boolean(DONATION_URL),
        });
        supportRow.add_prefix(new Gtk.Image({
            file: this.dir.get_child('donation-qr.svg').get_path(),
            pixel_size: 112,
            tooltip_text: 'ko-fi.com/vanceral 的二维码',
        }));
        if (DONATION_URL) {
            supportRow.add_suffix(new Gtk.Image({
                icon_name: 'adw-external-link-symbolic',
                valign: Gtk.Align.CENTER,
            }));
            supportRow.connect('activated', () => {
                Gtk.show_uri(window, DONATION_URL, Gdk.CURRENT_TIME);
            });
        }
        support.add(supportRow);

        // Workspace guidance
        const workspaceSetup = new Adw.PreferencesGroup({
            title: "推荐的工作区设置"
        });
        workspaceSetup.add(new Adw.ActionRow({
            title: "使用固定数量的工作区",
            subtitle: "在 GNOME 设置 → 多任务 → 工作区 中选择「固定数量的工作区」。推荐设置为 8 个。" +
                "动态工作区可能会移除空的工作区，使窗口移动的目标位置变得难以预期。"
        }));

        // Gesture Settings
        const gestures = new Adw.PreferencesGroup({ title: "手势" });
        this._createSwitch(
            gestures, "three-finger",
            "交换三指与四指手势",
            ""
        );
        this._createSwitch(
            gestures, "use-active-window",
            "只操作活动窗口",
            "开启后，手势将控制活动窗口，而不是指针所在的窗口。这会禁用缩放功能。"
        );

        this._createSwitch(
            gestures, "taphold-move",
            "按住并拖动以移动/缩放窗口",
            "通过按住并拖动来触发移动窗口，而不是向下滑动"
        );


        // Function Settings
        const fn = new Adw.PreferencesGroup({ title: "启用的功能" });
        this._createSwitch(
            fn, "pinch-enable",
            "启用捏合手势",
            ""
        );
        this._createSwitch(
            fn, "fn-resize",
            "启用窗口缩放",
            ""
        );
        this._createSwitch(
            fn, "fn-move",
            "启用窗口移动",
            ""
        );
        this._createSwitch(
            fn, "fn-fullscreen",
            "启用全屏",
            ""
        );
        this._createSwitch(
            fn, "fn-maximized-snap",
            "启用最大化窗口吸附",
            ""
        );
        this._createSwitch(
            fn, "fn-move-snap",
            "启用移动窗口吸附",
            ""
        );

        // Actions
        const action_list = [
            "禁用",
            "最小化窗口",          // 1
            "关闭窗口",            // 2
            "显示桌面",            // 3

            "下一个窗口",          // 4
            "上一个窗口",          // 5

            "窗口移到左侧工作区",  // 6
            "窗口移到右侧工作区",  // 7

            "后退",                // 8
            "前进",                // 9
            "提高亮度",            // 10
            "降低亮度",            // 11
            "增大音量",            // 12
            "降低音量",            // 13
            "静音",                // 14
            "播放/暂停",           // 15
            "下一曲",              // 16
            "上一曲",              // 17

            "Alt+Tab 切换",        // 18
            "活动概览",            // 19
            "应用列表",            // 20
            "快速设置",            // 21
            "通知中心",            // 22
            "运行命令 (Alt+F2)",   // 23

        ];

        const act1 = new Adw.PreferencesGroup({
            title: (isSwap ? "三" : "四") + "指手势动作"
        });
        this._createCombo(act1, "swipe4-left",
            "向左滑动", "", action_list);
        this._createCombo(act1, "swipe4-right",
            "向右滑动", "", action_list);
        this._createCombo(act1, "swipe4-updown",
            "向下滑动",
            "若未启用「按住并拖动以移动/缩放窗口」，向上滑动将等同于向下滑动",
            action_list);

        const act2 = new Adw.PreferencesGroup({
            title: (isSwap ? "四" : "三") + "指手势动作"
        });
        this._createCombo(act2, "swipe3-down",
            "向下滑动", "", action_list);
        this._createCombo(act2, "swipe3-left",
            "向下再向左滑动", "", action_list);
        this._createCombo(act2, "swipe3-right",
            "向下再向右滑动", "", action_list);
        this._createCombo(act2, "swipe3-downup",
            "向下再向上滑动", "", action_list);

        const act3 = new Adw.PreferencesGroup({ title: "捏合手势动作" });
        this._createCombo(act3, "pinch3-in",
            "三指捏合（向内）", "", action_list);
        this._createCombo(act3, "pinch3-out",
            "三指张开（向外）", "", action_list);
        this._createCombo(act3, "pinch4-in",
            "四指捏合（向内）", "", action_list);
        this._createCombo(act3, "pinch4-out",
            "四指张开（向外）", "", action_list);


        // Function Settings
        const ui = new Adw.PreferencesGroup({ title: "界面" });
        this._createCombo(ui, "ui-theme",
            "界面配色", "", [
            "跟随系统", "浅色", "深色"
        ]);
        this._createCombo(ui, "winswitch-position",
            "窗口切换界面位置", "", [
            "顶部", "居中", "底部"
        ]);


        // Tweaks Settings
        const tweaks = new Adw.PreferencesGroup({ title: "高级微调" });
        this._createSpin(tweaks, "edge-size",
            "缩放边缘宽度",
            "距窗口边缘多少像素内触发缩放操作",
            16, 96, 4);
        this._createSpin(tweaks, "top-edge-size",
            "标题栏边缘高度",
            "距窗口顶部多少像素内触发移动操作",
            16, 96, 4);
        this._createSpin(tweaks, "gesture-threshold",
            "手势触发阈值",
            "",
            16, 64, 4);
        this._createSpin(tweaks, "gesture-cancel-threshold",
            "手势取消阈值",
            "",
            4, 32, 1);
        this._createSpin(tweaks, "gesture-acceleration",
            "手势加速度",
            "",
            10, 25, 1);
        this._createSpin(tweaks, "pinch-in-scale",
            "捏合缩小的目标比例",
            "",
            30, 80, 5);
        this._createSpin(tweaks, "pinch-out-scale",
            "捏合放大的目标比例",
            "",
            120, 200, 5);


        // About
        const about = new Adw.PreferencesGroup({ title: "关于" });
        const aboutVersion = new Adw.ActionRow({
            title: 'Window Gestures Revived 版本',
        });
        aboutVersion.add_suffix(new Gtk.Label({
            label: this.metadata.version.toString(),
            css_classes: ['dim-label'],
        }));
        about.add(aboutVersion);

        const gnomeVersion = new Adw.ActionRow({
            title: 'GNOME 版本',
        });
        gnomeVersion.add_suffix(new Gtk.Label({
            label: PACKAGE_VERSION,
            css_classes: ['dim-label'],
        }));
        about.add(gnomeVersion);

        const githubRow = this._createLinkRow(window, 'GitHub 上的 Window Gestures Revived', this.metadata.url);
        about.add(githubRow);
        about.add(this._createLinkRow(
            window, 'Window Gestures 原项目', ORIGINAL_PROJECT_URL
        ));
        const aboutSupportRow = new Adw.ActionRow({
            title: '通过 Ko-fi 表达谢意',
            subtitle: '移植工作花费了大量精力。如果它对你有所帮助，欢迎小额赞助。',
            activatable: Boolean(DONATION_URL),
        });
        if (DONATION_URL) {
            aboutSupportRow.add_suffix(new Gtk.Image({
                icon_name: 'adw-external-link-symbolic',
                valign: Gtk.Align.CENTER,
            }));
            aboutSupportRow.connect('activated', () => {
                Gtk.show_uri(window, DONATION_URL, Gdk.CURRENT_TIME);
            });
        }
        about.add(aboutSupportRow);

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
        page.add(support);
        page.add(workspaceSetup);
        page.add(gestures);
        page.add(act1);
        page.add(act2);
        page.add(act3);
        page.add(fn);
        page.add(ui);
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
