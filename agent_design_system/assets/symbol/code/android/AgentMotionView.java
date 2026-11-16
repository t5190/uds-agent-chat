package com.example.agent;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.content.Context;
import android.util.AttributeSet;

import com.airbnb.lottie.LottieAnimationView;
import com.airbnb.lottie.LottieDrawable;

/**
 * AI Agent symbol motion. Requires: implementation "com.airbnb.android:lottie:6.4.0"
 * Copy the lottie json files into res/raw as agent_signature.json, agent_thinking_loop.json,
 * agent_thinking_end.json and agent_working.json.
 */
public class AgentMotionView extends LottieAnimationView {

    public enum State { SIGNATURE, THINKING, ENDING, WORKING, IDLE }

    private State state = State.IDLE;
    private boolean workPending = false;

    public AgentMotionView(Context context) { super(context); init(); }
    public AgentMotionView(Context context, AttributeSet attrs) { super(context, attrs); init(); }
    public AgentMotionView(Context context, AttributeSet attrs, int defStyle) { super(context, attrs, defStyle); init(); }

    private void init() {
        addAnimatorListener(new AnimatorListenerAdapter() {
            @Override public void onAnimationRepeat(Animator animation) {
                // switch only at a loop boundary, where thinking_end picks up exactly
                if (state == State.THINKING && workPending) startEnding();
            }
            @Override public void onAnimationEnd(Animator animation) {
                // thinking_end finishes on the circle that working starts from
                // (progress check ignores the cancel that setAnimation can trigger)
                if (state == State.ENDING && getProgress() >= 0.999f) startWorking();
            }
        });
    }

    /** First entry / onboarding: plays once and holds the final symbol. */
    public void playSignature() {
        workPending = false;
        start(State.SIGNATURE, R.raw.agent_signature, 0);
    }

    /** Thinking: three circles keep turning until {@link #work()} is called. */
    public void think() {
        workPending = false;
        start(State.THINKING, R.raw.agent_thinking_loop, LottieDrawable.INFINITE);
    }

    /** Working / responding: finishes the current thinking pass, melts into the circle, then loops. */
    public void work() {
        if (state == State.THINKING) {
            workPending = true;
        } else if (state != State.ENDING && state != State.WORKING) {
            startWorking();
        }
    }

    public void idle() {
        state = State.IDLE;
        workPending = false;
        cancelAnimation();
    }

    private void startEnding() {
        workPending = false;
        start(State.ENDING, R.raw.agent_thinking_end, 0);
    }

    private void startWorking() {
        start(State.WORKING, R.raw.agent_working, LottieDrawable.INFINITE);
    }

    private void start(State next, int rawRes, int repeatCount) {
        state = next;
        setAnimation(rawRes);
        setRepeatCount(repeatCount);
        playAnimation();
    }
}
