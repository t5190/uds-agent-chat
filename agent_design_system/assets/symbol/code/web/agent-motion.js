// AI Agent motion helper for lottie-web (https://github.com/airbnb/lottie-web)
// thinking_loop repeats while thinking; when work() is called it finishes the current pass,
// thinking_end melts the circles into the circle agent_working starts from, then working loops.
(function (global) {
  function play(el, path, { loop = false, autoplay = true } = {}) {
    return lottie.loadAnimation({ container: el, renderer: "svg", loop, autoplay, path });
  }

  // One slot that switches thinking -> working without a visible jump.
  function state(el, base) {
    const loop = play(el, base + "agent_thinking_loop/lottie/agent_thinking_loop.json", { loop: true, autoplay: false });
    const end = play(el, base + "agent_thinking_end/lottie/agent_thinking_end.json", { autoplay: false });
    const working = play(el, base + "agent_working/lottie/agent_working.json", { loop: true, autoplay: false });
    const all = [loop, end, working];
    let mode = "idle";
    let wantWork = false;

    const show = (a) => all.forEach((x) => { x.renderer.svgElement.style.display = x === a ? "" : "none"; });
    const startWork = () => { mode = "working"; wantWork = false; end.stop(); show(working); working.goToAndPlay(0, true); };
    const startEnd = () => { mode = "ending"; loop.stop(); show(end); end.goToAndPlay(0, true); };

    // switch only at a loop boundary, where thinking_end picks up exactly
    loop.addEventListener("loopComplete", () => { if (mode === "thinking" && wantWork) startEnd(); });
    end.addEventListener("complete", () => { if (mode === "ending") startWork(); });

    return {
      think() { mode = "thinking"; wantWork = false; working.stop(); end.stop(); show(loop); loop.goToAndPlay(0, true); },
      work() {
        if (mode === "thinking") wantWork = true;
        else if (mode !== "ending" && mode !== "working") startWork();
      },
      stop() { mode = "idle"; all.forEach((x) => x.stop()); },
      destroy() { all.forEach((x) => x.destroy()); },
    };
  }

  global.AgentMotion = { play, state };
})(window);
