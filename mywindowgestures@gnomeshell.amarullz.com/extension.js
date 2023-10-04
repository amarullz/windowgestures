/* extension.js
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

import Clutter from 'gi://Clutter';
import Meta from 'gi://Meta';

// Window edge action
const WindowEdgeAction = {
    NONE: 0, // No action
    WAIT_GESTURE: 1, // Wait for gesture flag
    MOVE: 2,   // Move flag
    RESIZE: 4, // Resize flag
    RESIZE_LEFT: 0x100,
    RESIZE_RIGHT: 0x200,
    RESIZE_BOTTOM: 0x400,
    RESIZE_TOP: 0x800
};

export default class Extension {

    // Enable Extension
    enable() {
        // Create virtual devices
        const seat = Clutter.get_default_backend().get_default_seat();
        this._virtualTouchpad = seat.create_virtual_device(
            Clutter.InputDeviceType.POINTER_DEVICE
        );
        this._virtualKeyboard = seat.create_virtual_device(
            Clutter.InputDeviceType.KEYBOARD_DEVICE
        );

        // Init variables - keep enable() clean
        this._clearVars();

        // Capture Touchpad Event
        this._gestureCallbackID = global.stage.connect(
            'captured-event::touchpad',
            this._touchEvent.bind(this)
        );
    }

    // Disable Extension
    disable() {
        // Release Touchpad Event Capture
        global.stage.disconnect(this._gestureCallbackID);

        // Cleanup virtual devices
        this._virtualTouchpad = null;
        this._virtualKeyboard = null;

        // Cleanup all variables
        this._clearVars();
    }

    // Get padding edge size
    _edgeSize() {
        return 32;
    }

    // Get top padding edge size
    _topEdgeSize() {
        return 64;
    }

    // Check edge flags
    _isEdge(edge) {
        return ((this._edgeAction & edge) == edge);
    }

    // Initialize variables
    _clearVars() {
        // Target window to manage
        this._targetWindow = null;

        // Mouse start position
        this._startPos = {
            x: 0, y: 0
        };

        // Mouse start position
        this._movePos = {
            x: 0, y: 0
        };

        // Monitor Workarea
        this._monitorArea = null;

        // Starting Window Area
        this._startWinArea = null;

        // Edge Action
        this._edgeAction = WindowEdgeAction.NONE;
    }

    // On touch gesture started
    _touchStarted() {
        // Get current mouse position
        let [pointerX, pointerY, pointerZ] = global.get_pointer();

        // Get actor in current mouse position
        let currActor = global.stage.get_actor_at_pos(
            Clutter.PickMode.REACTIVE, pointerX, pointerY
        );

        // Find root window for current actor
        let currWindow = currActor.get_parent();
        let i = 0;
        while (!currWindow.get_meta_window) {
            currWindow = currWindow.get_parent();
            // Hack for it to works, some apps only 1 level to root window,
            // some apps is multiple parents to root window.
            // loop until got the root (or max 10 level)
            if (!currWindow || (++i > 10)) {
                // cannot fetch root window, so ignore it!
                return Clutter.EVENT_PROPAGATE;
            }
        }

        // Set meta window as target window to manage
        this._targetWindow = currWindow.get_meta_window();

        // Set opener window as target if it was dialog
        if (this._targetWindow.is_attached_dialog()) {
            this._targetWindow = this._targetWindow.get_transient_for();
        }

        // Ignore unmoveable window
        if (!this._targetWindow.allows_move()) {
            this._targetWindow = null;
            return Clutter.EVENT_PROPAGATE;
        }

        // Save start position
        this._startPos.x = pointerX;
        this._startPos.y = pointerY;

        // Reset move position
        this._movePos.x = this._movePos.y = 0;

        // Activate window if not focused yet
        if (!this._targetWindow.has_focus()) {
            this._targetWindow.activate(
                global.get_current_time()
            );
        }

        // Get monitor area
        this._monitorArea = this._targetWindow.get_work_area_current_monitor();

        // Get start frame rectangle
        this._startWinArea = this._targetWindow.get_frame_rect();

        // Window area as local value
        let wLeft = this._startWinArea.x;
        let wTop = this._startWinArea.y;
        let wRight = wLeft + this._startWinArea.width;
        let wBottom = wTop + this._startWinArea.height;
        let wMidX = wLeft + (this._startWinArea.width / 2);
        let wMidY = wTop + (this._startWinArea.height / 2);

        // Detect window edge
        let edge = this._edgeSize();
        let topEdge = this._topEdgeSize();

        // Default edge: need move event for more actions
        this._edgeAction = WindowEdgeAction.WAIT_GESTURE;

        // Check allow resize
        if (this._targetWindow.allows_resize()) {
            // Edge cursor position detection
            if (this._startPos.y >= wBottom - edge) {
                // Cursor on bottom of window
                this._edgeAction =
                    WindowEdgeAction.RESIZE |
                    WindowEdgeAction.RESIZE_BOTTOM;

                // Half left / right
                if (this._startPos.x <= wMidX) {
                    this._edgeAction |= WindowEdgeAction.RESIZE_LEFT;
                }
                else {
                    this._edgeAction |= WindowEdgeAction.RESIZE_RIGHT;
                }
            }
            else {
                if (this._startPos.x <= wLeft + edge) {
                    // Cursor on left side of window
                    this._edgeAction =
                        WindowEdgeAction.RESIZE |
                        WindowEdgeAction.RESIZE_LEFT;
                }
                else if (this._startPos.x >= wRight - edge) {
                    // Cursor on right side of window
                    this._edgeAction =
                        WindowEdgeAction.RESIZE |
                        WindowEdgeAction.RESIZE_RIGHT;
                }
                if (this._isEdge(WindowEdgeAction.RESIZE)) {
                    // Half top / bottom
                    if (this._startPos.y <= wMidY) {
                        this._edgeAction |= WindowEdgeAction.RESIZE_TOP;
                    }
                    else {
                        this._edgeAction |= WindowEdgeAction.RESIZE_BOTTOM;
                    }
                }
            }
        }
        if (!this._isEdge(WindowEdgeAction.RESIZE)) {
            if (this._startPos.y <= wTop + topEdge) {
                // Mouse in top side of window
                this._edgeAction = WindowEdgeAction.MOVE;
            }
        }

        return Clutter.EVENT_STOP;
    }

    // On touch gesture updated
    _touchUpdate(dx, dy) {
        // Ignore if no target window
        if (this._targetWindow == null) {
            return Clutter.EVENT_PROPAGATE;
        }

        // Ignore if no edge action (will not happened btw)
        if (this._edgeAction == WindowEdgeAction.NONE) {
            this._clearVars();
            return Clutter.EVENT_PROPAGATE;
        }

        // Set event time
        const currentTime = global.get_current_time();

        // Move cursor pointer
        this._virtualTouchpad.notify_relative_motion(
            currentTime, dx, dy
        );

        // Moving coordinat
        this._movePos.x += dx;
        this._movePos.y += dy;

        // Window area as local value
        let wLeft = this._startWinArea.x;
        let wTop = this._startWinArea.y;
        let wRight = wLeft + this._startWinArea.width;
        let wBottom = wTop + this._startWinArea.height;

        if (this._isEdge(WindowEdgeAction.MOVE)) {
            // Move action
            this._targetWindow.move_frame(
                true,
                this._startWinArea.x + this._movePos.x,
                this._startWinArea.y + this._movePos.y
            );
        }
        else if (this._isEdge(WindowEdgeAction.RESIZE)) {
            // Resize actions
            let tX = this._startWinArea.x;
            let tY = this._startWinArea.y;
            let tW = this._startWinArea.width;
            let tH = this._startWinArea.height;

            if (this._isEdge(WindowEdgeAction.RESIZE_BOTTOM)) {
                tH += this._movePos.y;
            }
            else {
                tY += this._movePos.y;
                tH -= this._movePos.y;
            }
            if (this._isEdge(WindowEdgeAction.RESIZE_RIGHT)) {
                tW += this._movePos.x;
            }
            else {
                tX += this._movePos.x;
                tW -= this._movePos.x;
            }
            // Resize Window
            this._targetWindow.move_resize_frame(
                true,
                tX, tY, tW, tH
            );
        }

        return Clutter.EVENT_STOP;
    }

    // On touch gesture ended
    _touchEnd() {

    }

    // Touch Event Handler
    _touchEvent(actor, event) {
        // Only process swipe event
        if (event.type() != Clutter.EventType.TOUCHPAD_SWIPE)
            return Clutter.EVENT_PROPAGATE;

        // Only process 4 finger gesture
        if (event.get_touchpad_gesture_finger_count() != 4)
            return Clutter.EVENT_PROPAGATE;

        // Process gestures state
        switch (event.get_gesture_phase()) {
            case Clutter.TouchpadGesturePhase.BEGIN:
                // Begin event
                return this._touchStarted();

            case Clutter.TouchpadGesturePhase.UPDATE:
                // Update / move event
                let [dx, dy] = event.get_gesture_motion_delta();
                return this._touchUpdate(dx, dy);

            default:
                // Cancel / end event
                return this._touchEnd();
        }
        return Clutter.EVENT_STOP;
    }

}
