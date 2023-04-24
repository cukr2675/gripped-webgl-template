mergeInto(LibraryManager.library, {

  GrippedWebGLLockAspectRatio: function (aspectRatio) {
    grippedWebGLTemplate.setAspectRatio(aspectRatio);
  },

  GrippedWebGLFreeAspectRatio: function () {
    grippedWebGLTemplate.setAspectRatio(null);
  },

  GrippedWebGLSetOverflowFromWindow: function (booleanIndex) {
    if (booleanIndex == 1) {
      // false
      grippedWebGLTemplate.overflowFromWindow = false;
    } else if (booleanIndex == 2) {
      // true
      grippedWebGLTemplate.overflowFromWindow = true;
    }
  },

  GrippedWebGLSetUseFixedCanvas: function (booleanIndex) {
    if (booleanIndex == 1) {
      // false
      grippedWebGLTemplate.useFixedCanvas = false;
    } else if (booleanIndex == 2) {
      // true
      grippedWebGLTemplate.useFixedCanvas = true;
    }
  },

});