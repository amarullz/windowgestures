# Window Gestures Revived（窗口手势）

[English](README.md) | 简体中文

Window Gestures Revived 是 [Window Gestures](https://github.com/amarullz/windowgestures) 的社区续作，后者是一个用触摸板手势控制和移动窗口的 GNOME Shell 扩展。本分支将其适配到当前的 GNOME Shell 版本，同时保留原有的设置 schema 与手势行为。

本仓库为**简体中文汉化分支**：扩展偏好设置的界面文本、扩展名称与描述、GSettings 键描述均已翻译为简体中文，手势功能与设置项保持不变。

## 功能

- 为三指、四指的滑动、捏合和按住操作分配动作
- 用触摸板手势移动和缩放窗口
- 用手势把窗口送到相邻工作区
- 最大化、还原、全屏以及窗口吸附
- 自定义手势阈值、加速度和界面位置

## 移动窗口，然后继续前进

在默认手势设置下，四指水平滑动会把当前聚焦的窗口送到相邻工作区。随后使用 GNOME 的三指工作区手势继续操作，窗口会留在你放置它的那个工作区。每次四指手势移动一个工作区。

![三步图解：用四指把聚焦窗口移到相邻工作区，再用三指继续切换到别的工作区](docs/gesture-workflow.svg)

GNOME 51 Shell 风格插图，并非屏幕截图。

## 缩放、预览与个性化

四指垂直滑动会依据当前聚焦窗口的状态变化：上滑最大化，再上滑进入全屏，下滑则逐级退回这些状态。窗口还原后，如果想再用一次下滑把它收起，可以把可配置的向下滑动动作设为 **最小化**。

默认的三指快捷操作包括：下滑显示桌面，向内捏合最小化聚焦窗口，向外张开显示桌面。四指的捏合动作在未分配前处于关闭状态。可配置的滑动与捏合动作在扩展的偏好设置中修改。

![与上文对应的图解：四指窗口缩放、三指桌面与捏合快捷操作，以及可自定义的四指捏合](docs/gesture-actions.svg)

GNOME 51 Shell 风格插图，并非屏幕截图。

## 兼容性

扩展的 metadata 声明支持 GNOME Shell 49 至 51。GNOME 51 的移植版本、扩展改名和偏好设置由维护者在 Fedora 45 上安装并使用过。GNOME Shell 49 和 50 是依据其文档化 API 声明的，但并未在独立的 Shell 会话中实际验证。GNOME 45 至 48 不再声明支持：本次移植使用了 GNOME 49 引入的 `Mtk.Rectangle` 和 `Meta.Window` API。

本扩展使用了 GNOME Shell 的内部实现。只有当审阅了新版本的扩展升级指南并适配了受影响的 API 之后，才会加入新的 GNOME 版本支持。当前维护与发布清单见 [TASKS.md](TASKS.md)。

## 推荐的工作区设置

窗口转移在固定工作区数量下效果最好。打开 **设置 → 多任务 → 工作区**，选择 **固定数量的工作区**，把数量设为 **8**，这样移动窗口时空间更宽裕。在动态工作区下，GNOME 可能会移除空的工作区，导致目标位置不够可预期。扩展的偏好设置里也会显示这条建议。

## 从构建产物安装

安装本分支之前，请先停用原有的 **Window Gestures** 扩展，以免两个扩展抢占相同的触摸板手势。然后构建并安装 ZIP：

```sh
./build.sh
gnome-extensions install --force windowgesturesrevived@vanceral.github.io.zip
```

在 Wayland 下需要注销并重新登录，然后在「扩展」应用中启用 **Window Gestures Revived**。本分支有自己的扩展 UUID，因此 GNOME 会把它当作一个独立的扩展。它沿用原有的设置 schema ID，所以既有的手势偏好可以保留。

## 构建依赖

构建需要 `glib-compile-schemas` 和 `zip`。在仓库根目录执行：

```sh
./build.sh
```

该脚本会严格校验 GSettings schema 且不生成缓存，然后只把 XML schema 打进 `windowgesturesrevived@vanceral.github.io.zip`。GNOME Shell 会在需要时自行编译 schema。生成的 schema 缓存和 ZIP 压缩包不应提交到仓库。

## 报告问题

请说明你的 GNOME Shell 版本、发行版、使用的是 Wayland 还是 X11、涉及的手势与动作，以及复现问题的步骤。如果是运行时错误，请附上相关的 GNOME Shell 日志片段。不要包含无关日志中的隐私信息。

## 项目历史与致谢

本仓库 fork 自 [thyttan/windowgestures](https://github.com/thyttan/windowgestures)，该项目承接了 Amarullz 的原始项目。原作者及其工作均予以署名。Window Gestures Revived 是独立的社区续作，与原作者没有隶属关系。

本项目是自由软件，采用 GPL-2.0-or-later 许可。详见 [COPYING](COPYING)。

## 支持

GNOME 兼容性工作投入了大量的调研、调试和测试。如果这个扩展对你有帮助，可以通过 [Ko-fi 赞助](https://ko-fi.com/vanceral)表示感谢。偏好设置中包含同一个链接和二维码。赞助完全自愿，非常感谢。

## 变更日志

各版本的变更见 [CHANGELOG.md](CHANGELOG.md)。
