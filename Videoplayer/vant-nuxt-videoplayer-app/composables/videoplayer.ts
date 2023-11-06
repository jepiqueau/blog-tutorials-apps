import { CapacitorVideoPlayer } from 'capacitor-video-player';
import { Capacitor } from '@capacitor/core';

export interface VideoPlayerOuput  {
    result?: boolean;
    method?: string;
    value?: any;
    message?: string;
}

interface PlayerData {
    mode: string,
    url: string,
    playerId: string,
    componentTag: string, 
    subtitle?: string | null,
    language?: string | null,
    subtitleOptions?: any | null,
    rate?: number | null,
    exitOnEnd?: boolean | null,
    loopOnEnd?: boolean | null,
    pipEnabled?: boolean | null,
    bkmodeEnabled?: boolean | null,
    showControls?: boolean | null,
    displayMode?: string | null,
    width?: number | null,
    height?: number | null
}

export interface VideoPlayerHook {
    echo: (value: string) => Promise<{value: string}>;
    initPlayer: (mode: string, url: string, playerId: string,
        componenTag: string, subTitleUrl?: string, 
        subTitleLangage?: string, subTitleOptions?: any, 
        rate?: number, exitOnEnd?: boolean, loopOnEnd?: boolean,
        pipEnabled?: boolean, bkmodeEnabled?: boolean,
        showControls?: boolean, displayMode?: string,
        width?:number, height?:number) => 
        Promise<VideoPlayerOuput>;
    isPlaying: (playerId: string) => Promise<VideoPlayerOuput>;
    pause: (playerId: string) => Promise<VideoPlayerOuput>;
    play: (playerId: string) => Promise<VideoPlayerOuput>;
    getDuration: (playerId: string) => Promise<VideoPlayerOuput>;
    setVolume: (playerId: string, volume: number) => 
        Promise<VideoPlayerOuput>;
    getVolume: (playerId: string) => Promise<VideoPlayerOuput>;
    setMuted: (playerId: string, muted: boolean) => 
        Promise<VideoPlayerOuput>;
    getMuted: (playerId: string) => Promise<VideoPlayerOuput>;
    setCurrentTime: (playerId: string, seektime: number) => 
        Promise<VideoPlayerOuput>;
    getCurrentTime: (playerId: string) => Promise<VideoPlayerOuput>;
    stopAllPlayers: () => Promise<VideoPlayerOuput>;
    removeListeners: () => Promise<void>;
    getPlatform: () => Promise<{platform: string}>;
}

export function useVideoPlayer(emit: (event: "onPlay" | "onPause" | "onEnded" | "onExit" | "onReady", ...args: any[]) => void): VideoPlayerHook {
    const platform = Capacitor.getPlatform();
    const vpPlugin: any = CapacitorVideoPlayer;
    let playListener: any;
    let pauseListener: any;
    let endedListener: any;
    let exitListener: any;
    let readyListener: any;
    
    /**
     * Add Listeners
     */
    const addListeners = async (): Promise<void> => {
        playListener = await vpPlugin.addListener('jeepCapVideoPlayerPlay',
            (e: any) => {
                const fromPlayerId = e.fromPlayerId;
                const currentTime = e.currentTime
                emit('onPlay', {fromPlayerId, currentTime})
            }, false);
        pauseListener = await vpPlugin.addListener('jeepCapVideoPlayerPause',
            (e: any) => {
                const fromPlayerId = e.fromPlayerId;
                const currentTime = e.currentTime
                emit('onPause', {fromPlayerId, currentTime})
            }, false);
        endedListener = await vpPlugin.addListener('jeepCapVideoPlayerEnded',
            (e: any) => {
                const fromPlayerId = e.fromPlayerId;
                const currentTime = e.currentTime
                emit('onEnded', {fromPlayerId, currentTime})
            }, false);
        exitListener = await vpPlugin.addListener('jeepCapVideoPlayerExit',
            (e: any) => {
                const dismiss = e.dismiss;
                emit('onExit', {dismiss})
            },false);
        readyListener = await vpPlugin.addListener('jeepCapVideoPlayerReady',
            (e: any) => {
                const fromPlayerId = e.fromPlayerId;
                const currentTime = e.currentTime
                emit('onReady', {fromPlayerId, currentTime})
            }, false);
    }
    /**
     * Remove Listeners
     */
    const removeListeners = async (): Promise<void> => {
        await playListener.remove();
        await pauseListener.remove();
        await endedListener.remove();
        await exitListener.remove();
        await readyListener.remove();
    };
    /**
     * Echo value
     * @param value 
     */
    const echo = async (value: string): Promise<{value: string}> => {
        const ret = {value: ""};
        if(value) {
            const r = await vpPlugin.echo(value);
            if(r) {
                return r;
            }
            return ret;    
        } else {
            ret.value = "Echo: failed";
            return ret;
        }
    };
    /**
     * Get Platform
     */
    const getPlatform = async (): Promise<any> => {
        return {platform: platform};
    };
    /**
     * Method initPlayer
     * Init the player
     * @param mode 
     * @param url 
     * @param playerId 
     * @param componentTag 
     * @param subTitleUrl 
     * @param subTitleLanguage 
     * @param subTitleOptions 
     * @param width 
     * @param height 
     * @returns 
     */
    const initPlayer = async (mode: string, url : string,
        playerId: string, componentTag: string,
        subTitleUrl?: string , subTitleLanguage?: string, subTitleOptions?: any,
        rate?: number, exitOnEnd?: boolean, loopOnEnd?: boolean,
        pipEnabled?: boolean, bkmodeEnabled?: boolean,
        showControls?: boolean, displayMode?: string) => {
        const playerData: PlayerData = {mode: mode, url: url, 
            playerId: playerId, componentTag: componentTag}
        playerData.subtitle = subTitleUrl != null ? subTitleUrl : null; 
        playerData.language = subTitleLanguage != null ? subTitleLanguage : null;
        if(subTitleOptions != null) {
            playerData.subtitleOptions = {};
            if(subTitleOptions.backgroundColor != null)
                playerData.subtitleOptions.backgroundColor = subTitleOptions.backgroundColor;
            if(subTitleOptions.fontSize != null)
                playerData.subtitleOptions.fontSize = subTitleOptions.fontSize;
            if(subTitleOptions.foregroundColor != null)
                playerData.subtitleOptions.foregroundColor = subTitleOptions.foregroundColor;
            
        } else {
            playerData.subtitleOptions = null;
        }
        playerData.rate = rate != null ? rate : 1; 
        playerData.exitOnEnd = exitOnEnd != null ? exitOnEnd : true; 
        playerData.loopOnEnd = loopOnEnd != null ? loopOnEnd : false; 
        playerData.pipEnabled = pipEnabled != null ? pipEnabled : true; 
        playerData.bkmodeEnabled = bkmodeEnabled != null ? bkmodeEnabled : true; 
        playerData.displayMode = displayMode != null ? displayMode : 'portrait'; 

        const r = await vpPlugin.initPlayer(playerData);
        if (r) {
            if( typeof r.result != 'undefined') {
                return r;
            }
        }
        return {result: false, method: "initPlayer", 
                message: "initPlayer failed"};
    }; 
    /**
     * Method isPlaying 
     * @param playerId string
     */
    const isPlaying = async (playerId: string) => {
        const r = await vpPlugin.isPlaying({ playerId:playerId });
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
        return { result: false, method: "isPlaying",
            message: "isPlaying failed" };

    };

    /**
     * Method pause 
     * pause the videoplayer 
     * @param playerId string
     */
    const pause = async (playerId: string) => {
        const r = await vpPlugin.pause({ playerId: playerId });
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
        return { result: false, method: "pause",
            message: "pause failed" };

    };

    /**
     * Method play 
     * play the videoplayer 
     * @param playerId string
     */
    const play = async (playerId: string) => {
        const r = await vpPlugin.play({ playerId: playerId });
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
        return { result: false, method: "play",
            message: "play failed" };

    };

    /**
     * Method getDuration 
     * get the video duration
     * @param playerId string
     */
    const getDuration = async (playerId: string) => {
        const r = await vpPlugin.getDuration({ 
            playerId: playerId });
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
        return { result: false, method: "getDuration",
            message: "getDuration failed" };

    };

    /**
     * Method setVolume 
     * set the video volume
     * @param playerId string
     * @param volume number
     */
    const setVolume = async (playerId: string,
            volume: number) => {
        const r = await vpPlugin.setVolume({ playerId: playerId,
            volume: volume });
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
        return { result: false, method: "setVolume",
            message: "setVolume failed" };

    };

    /**
     * Method getVolume 
     * get the video volume
     * @param playerId string
     */
    const getVolume = async (playerId: string) => {
        const r = await vpPlugin.getVolume({ 
                playerId: playerId });
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
    return { result: false, method: "getVolume",
        message: "getVolume failed" };

    };

    /**
     * Method setMuted 
     * set the video muted parameter
     * @param playerId string
     * @param muted boolean
     */
    const setMuted = async (playerId: string,
            muted: boolean) => {
        const r = await vpPlugin.setMuted({ 
                playerId: playerId, muted: muted });
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
        return { result: false, method: "setMuted",
            message: "setMuted failed" };

    };

    /**
     * Method getMuted 
     * get the video muted parameter
     * @param playerId string
     */
    const getMuted = async (playerId: string) => {
        const r = await vpPlugin.getMuted({ playerId: playerId });
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
        return { result: false, method: "getMuted",
            message: "getMuted failed" };

    };

    /**
     * Method setCurrentTime 
     * set the video current time
     * @param playerId string
     * @param seektime number
     */
    const setCurrentTime = async (playerId: string,
                seektime: number) => {
        const r = await vpPlugin.setCurrentTime({ 
            playerId: playerId, seektime: seektime });
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
        return { result: false, method: "setCurrentTime",
            message: "setCurrentTime failed" };

    };

    /**
     * Method getCurrentTime 
     * get the video current time
     * @param playerId string
     */
    const getCurrentTime = async (playerId: string) => {
        const r = await vpPlugin.getCurrentTime({ 
            playerId: playerId });
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
        return { result: false, method: "getCurrentTime",
            message: "getCurrentTime failed" };

    };

    /**
     * Method stopAllPlayers
     * stop all players
     */
    const stopAllPlayers = async () => {
        const r = await vpPlugin.stopAllPlayers();
        if (r) {
            if (typeof r.result != 'undefined') {
                return r;
            }
        }
        return { result: false, method: "stopAllPlayers",
            message: "stopAllPlayers failed" };

    };

    // Add Listeners
    addListeners();
    
    return { echo, initPlayer, isPlaying, play, pause, getDuration,
        setVolume, getVolume, setMuted, getMuted, setCurrentTime, 
        getCurrentTime, stopAllPlayers, removeListeners, getPlatform };
}
