using System;
using System.Web.Optimization;

namespace BattcherIntel {
  public class DurandalBundleConfig {
    public static void RegisterBundles(BundleCollection bundles) {
      bundles.IgnoreList.Clear();
      AddDefaultIgnorePatterns(bundles.IgnoreList);

      bundles.Add(
        new StyleBundle("~/Content/biacss")
          .Include("~/Content/bootstrap.min.css")
          .Include("~/Content/font-awesome.min.css")
		  .Include("~/Content/durandal.css")
          .Include("~/Content/starterkit.css")
          .Include("~/Content/nprogress.css")
          .Include("~/Content/toastr.css")
        );
    }

    public static void AddDefaultIgnorePatterns(IgnoreList ignoreList) {
      if(ignoreList == null) {
        throw new ArgumentNullException("ignoreList");
      }

      ignoreList.Ignore("*.intellisense.js");
      ignoreList.Ignore("*-vsdoc.js");
      ignoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
      //ignoreList.Ignore("*.min.js", OptimizationMode.WhenDisabled);
      //ignoreList.Ignore("*.min.css", OptimizationMode.WhenDisabled);
    }
  }
}