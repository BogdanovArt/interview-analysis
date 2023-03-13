import React, { useState, useCallback } from "react";
import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const styles = {
  height: "100%",
  border: "0px solid transparent",
};

interface Props {
  children: JSX.Element | JSX.Element[];
  active?: boolean;
  eventHandler?: (e: React.KeyboardEvent<Document>) => void;
  onLoad?: (ref: Document) => void;
}

export const IFrame = ({
  children,
  active,
  onLoad,
  eventHandler = () => null,
  ...props
}: Props) => {
  const iframe = useRef(null);
  const [docRef, setDocRef] = useState(null);

  const extractHead = () => {
    return document.getElementsByTagName("head")?.[0]?.innerHTML || "";
  };

  const addStyles = (document: HTMLDocument) => {
    const headID = document.getElementsByTagName("head")[0];
    const head = extractHead();
    const body = docRef.body;
    headID.innerHTML = head;
    docRef.documentElement.style.width = "100%";
    body.classList.add("theme--light");
    body.classList.add("app");
    body.style.width = "100%";
    body.style.overflow = "hidden";
    body.style.display = "block";
  };

  useEffect(() => {
    if (iframe?.current?.contentWindow?.document && !docRef) {
      setDocRef(iframe?.current?.contentWindow?.document);
    }
  }, [iframe]);

  useEffect(() => {
    if (docRef) {
      addStyles(iframe?.current?.contentWindow?.document);
    }
  }, [docRef]);

  return (
    <iframe {...props} ref={iframe} style={styles}>
      {docRef && createPortal(children, docRef.body)}
    </iframe>
  );
};
