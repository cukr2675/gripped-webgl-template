mergeInto(LibraryManager.library, {

  GrippedWebGLLockAspectRatio: function (aspectRatio) {
    grippedWebGLTemplate.setAspectRatio(aspectRatio);
  },

  GrippedWebGLFreeAspectRatio: function () {
    grippedWebGLTemplate.setAspectRatio(null);
  },

});