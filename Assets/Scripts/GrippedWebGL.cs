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
#endif

        public static void LockAspectRatio(float aspectRatio)
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            GrippedWebGLLockAspectRatio(aspectRatio);
#endif
        }

        public static void FreeAspectRatio()
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            GrippedWebGLFreeAspectRatio();
#endif
        }
    }
}
