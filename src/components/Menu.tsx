import { Button, Tab, Tabs } from "@udixio/ui";
import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";

function formatLabel(id) {
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const Menu = ({
  setFabVisible,
  fabVisible,
}: {
  fabVisible: boolean;
  setFabVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [ids, setIds] = useState<string[]>([]); // Initial ids array is set to empty

  const [activeTab, setActiveTab] = useState<number | null>(1);
  const observers = useRef<IntersectionObserver[]>([]);

  const isScrolling = useRef(false);

  useEffect(() => {
    const features = Array.from(document.querySelectorAll(".tab-menu"));
    const featureIds = features.map((feature) => feature.id).filter(String);
    setIds(featureIds);
  }, []);

  useEffect(() => {
    if (!ids) return;

    // Initialize Intersection Observers for each feature
    const initObservers = () => {
      observers.current = ids.map((id, index) => {
        const el = document.getElementById(id)!;
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && !isScrolling.current) {
              const classes = entry.target.className.split(" ");
              const themeClass =
                classes.find((cls) => cls.startsWith("theme-")) ?? "theme-blue";
              const themeChangeEvent = new CustomEvent("themeChange", {
                detail: themeClass,
              });
              window.dispatchEvent(themeChangeEvent);
              setActiveTab(index);

              setFabVisible(true);
            }
          },
          { threshold: [0.2] },
        );
        observer.observe(el);
        return observer;
      });
    };

    // Clean up observers on unmount
    const cleanUpObservers = () => {
      observers.current.forEach((ob) => ob.disconnect());
    };

    initObservers();

    return cleanUpObservers;
  }, [ids]);

  useEffect(() => {
    const handleHashChange = () => {
      isScrolling.current = true;

      setTimeout(() => {
        isScrolling.current = false;
      }, 750);
    };

    window.addEventListener("popstate", handleHashChange, false);
    return () => {
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  useEffect(() => {
    const featuresDiv = document.getElementById("contact")!;

    const featuresObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveTab(null);
          setFabVisible(false);
          const themeChangeEvent = new CustomEvent("themeChange", {
            detail: "theme-purple",
          });
          window.dispatchEvent(themeChangeEvent);
        }
      },
      { threshold: [0] },
    );
    featuresObserver.observe(featuresDiv);

    return () => featuresObserver.disconnect();
  }, []);

  return (
    <div
      className={classNames(
        "fixed max-w-full flex transition-opacity left-1/2 duration-300 ease-in-out top-8 z-50 mx-2 backdrop-blur-lg -translate-x-1/2 overflow-hidden rounded-full border border-surface-container-highest bg-surface-container-low/80",
        { "opacity-0": activeTab === null },
      )}
    >
      <Tabs
        scrollable
        selectedTab={activeTab}
        setSelectedTab={setActiveTab}
        className={"max-w-3xl  border-none  md:overflow-hidden"}
        variant={"secondary"}
      >
        {ids.map((id, index) => (
          <Tab
            className={"bg-transparent md:h-full"}
            selected={index === activeTab}
            href={`#${id}`}
            label={formatLabel(id)}
            // key={id}
          ></Tab>
        ))}
      </Tabs>
      <Button
        href={"#contact"}
        className={"m-2 hidden md:block"}
        label={"Contact"}
      />
    </div>
  );
};
