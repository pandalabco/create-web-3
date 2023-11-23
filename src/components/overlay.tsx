"use client";
import Image from "next/image";
import React from "react";
import {
  AiFillCamera,
  AiOutlineArrowLeft,
  AiOutlineHighlight
} from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useSnapshot } from "valtio";
import state from "@cw3/lib/store";

const Intro = ({ config }: any) => {
  const snap = useSnapshot(state);
  return (
    <motion.section key="main" {...config} className="z-10">
      <div className="section--container">
        <div>
          <h1>{`LET'S DO IT.`}</h1>
        </div>
        <div className="support--content">
          <div>
            <p>
              Create your unique and exclusive shirt with our brand-new 3D
              customization tool. <strong>Unleash your imagination</strong> and
              define your own style.
            </p>
            <button
              style={{ background: snap.selectedColor }}
              onClick={() => (state.intro = false)}
            >
              CUSTOMIZE IT <AiOutlineHighlight size="1.3em" />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

function Customizer({ config }: { config: any }) {
  const snap = useSnapshot(state);

  return (
    <motion.section key="custom" {...config}>
      <div className="customizer">
        <div className="color-options">
          {snap.colors.map((color) => (
            <div
              onClick={() => {
                state.selectedColor = color;
              }}
              key={color}
              className="circle"
              style={{ background: color }}
            ></div>
          ))}
        </div>
        <button
          className="share"
          style={{ background: snap.selectedColor }}
          onClick={() => {
            const link = document.createElement("a");
            link.setAttribute("download", "panda-shirt.png");
            link.setAttribute(
              "href",
              (document as any)
                ?.querySelector("canvas")
                ?.toDataURL("image/png")
                .replace("image/png", "image/octet-stream")
            );
            link.click();
          }}
        >
          DOWNLOAD
          <AiFillCamera size="1.3em" />
        </button>
        <button
          className="exit"
          style={{ background: snap.selectedColor }}
          onClick={() => (state.intro = true)}
        >
          GO BACK
          <AiOutlineArrowLeft size="1.3em" />
        </button>
      </div>
    </motion.section>
  );
}

type Props = {};

const Overlay = (props: Props) => {
  const snap = useSnapshot(state);
  const transition = { type: "spring", duration: 0.8 };
  const config = {
    initial: {
      x: -100,
      opacity: 0,
      transition: { ...transition, delay: 0.5 }
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: { ...transition, delay: 0 }
    },
    exit: {
      x: -100,
      opacity: 0,
      transition: { ...transition, delay: 0.5 }
    }
  };
  return (
    <div className="container w-full min-w-screen mx-auto">
      <motion.header
        initial={{ opacity: 0, y: -120 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5, type: "spring" }}
      >
        <Image
          src="/logo.png"
          width={150}
          height={150}
          alt="Logo de Panda Lab"
        />
      </motion.header>
      <AnimatePresence>
        {snap.intro ? (
          <Intro key="main" config={config} />
        ) : (
          <Customizer key="custom" config={config} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Overlay;
