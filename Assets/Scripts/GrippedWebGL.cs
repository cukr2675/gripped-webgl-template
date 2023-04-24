using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using System.Runtime.InteropServices;

namespace GrippedWebGLTemplate
{
    public class GrippedWebGL
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        [DllImport("__Internal")]
        private static extern void GrippedWebGLLockAspectRatio(float aspectRatio);
        
        [DllImport("__Internal")]
        private static extern void GrippedWebGLFreeAspectRatio();

        [DllImport("__Internal")]
        private static extern void GrippedWebGLSetOverflowFromWindow(int booleanIndex);

        [DllImport("__Internal")]
        private static extern void GrippedWebGLSetUseFixedCanvas(int booleanIndex);
#endif

        /// <param name="overflowFromWindow">true のときゲーム画面がブラウザの画面下にはみ出すことを許可する</param>
        /// <param name="useFixedCanvas">true のときゲーム画面がスクロールで移動しないよう設定する</param>
        public static void LockAspectRatio(float aspectRatio, JSBoolean overflowFromWindow = default, JSBoolean useFixedCanvas = default)
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            GrippedWebGLLockAspectRatio(aspectRatio);
            GrippedWebGLSetOverflowFromWindow(overflowFromWindow.Index);
            GrippedWebGLSetUseFixedCanvas(useFixedCanvas.Index);
#endif
        }

        /// <param name="overflowFromWindow">true のときゲーム画面がブラウザの画面下にはみ出すことを許可する</param>
        /// <param name="useFixedCanvas">true のときゲーム画面がスクロールで移動しないよう設定する</param>
        public static void FreeAspectRatio(JSBoolean overflowFromWindow = default, JSBoolean useFixedCanvas = default)
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            GrippedWebGLFreeAspectRatio();
            GrippedWebGLSetOverflowFromWindow(overflowFromWindow.Index);
            GrippedWebGLSetUseFixedCanvas(useFixedCanvas.Index);
#endif
        }

        public struct JSBoolean
        {
            public int Index { get; }

            public static JSBoolean Undefined => new JSBoolean(0);
            public static JSBoolean False => new JSBoolean(1);
            public static JSBoolean True => new JSBoolean(2);

            private JSBoolean(int index)
            {
                Index = index;
            }

            public static implicit operator JSBoolean(bool value) => value ? True : False;
        }
    }
}
