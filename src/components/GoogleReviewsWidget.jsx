import { useEffect } from "react";

const GoogleReviewsWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="my-12 px-6">
      <div
        className="elfsight-app-26552e03-d8be-46bd-bc9c-598cb63d98fb"
        data-elfsight-app-lazy
      ></div>
    </div>
  );
};

export default GoogleReviewsWidget;
