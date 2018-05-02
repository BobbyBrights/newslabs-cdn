/*
 * general useful functions
 */
var bbc=bbc||{}
bbc.Jlog=function(_j, asString)
{
    // pretty-print/freeze a JSON object
    if (typeof(bbc.$disableJlog)==='undefined') {
        if (typeof(_j)=='string' || typeof(_j)=='number') {
            console.log(_j);
        } else if (Array.isArray(_j)) {
            if (asString) {
                console.log(_j.slice(0).toString())
            } else {
                console.log(_j.slice(0))
            }
        } else if (typeof(_j)=='object') {
            if (asString) {
                console.log(JSON.stringify(bbc.Jcp(_j), null, "  "))
            } else {
                console.log(bbc.Jcp(_j))
            }
        } else {
            console.log(_j)
        }
    }
}
bbc.Jcp=function($json)
{
    // copy a JSON object - use when you want a true copy, not just another reference
    return JSON.parse(JSON.stringify($json))
}

/*
 * General broadcast-related utils
 *
 */
var bbcnpf=bbcnpf||{}
bbcnpf.utils=bbcnpf.utils||{}

bbcnpf.utils.$FPS=25

bbcnpf.utils.fDebounce=function(func, wait, immediate)
{
    // credit: http://davidwalsh.name/javascript-debounce-function
    var timeout
    return function() {
        var context=this, args=arguments
        var later=function() {
            timeout=null
            if(!immediate)func.apply(context, args)
        }
        var callNow=immediate && !timeout
        clearTimeout(timeout)
        timeout=setTimeout(later, wait)
        if(callNow)func.apply(context, args)
    }
}

bbcnpf.utils.registerOnFrameCallback=function(callback)
{
    if ((typeof(callback)).toLowerCase()=='function')
    {
        bbcnpf.utils.$registeredOnFrameCallbacks=bbcnpf.utils.$registeredOnFrameCallbacks || new Array()
        bbcnpf.utils.$registeredOnFrameCallbacks[callback]=callback
    }
}

bbcnpf.utils.registerPlayer=function(videoplayer)
{
    if (typeof(videoplayer)!=='undefined' && videoplayer.tagName.toLowerCase()=='video')
    {
        bbcnpf.utils.$registeredPlayer=videoplayer
        bbcnpf.utils.$registeredPlayerCurrentFrame=bbcnpf.utils.seconds2frames(bbcnpf.utils.$registeredPlayer.currentTime)
        bbcnpf.utils.$registeredPlayerPrevFrame=bbcnpf.utils.$registeredPlayerCurrentFrame
        videoplayer.addEventListener('play', bbcnpf.utils.playerPlaying)
        videoplayer.addEventListener('seeking', bbcnpf.utils.playerUpdateFrame)
        videoplayer.addEventListener('seeked', bbcnpf.utils.playerUpdateFrame)
    }
}

bbcnpf.utils.playerUpdateFrame=function()
{
    bbcnpf.utils.$registeredPlayerCurrentFrame=bbcnpf.utils.seconds2frames(bbcnpf.utils.$registeredPlayer.currentTime)
    if (bbcnpf.utils.$registeredPlayerCurrentFrame!=bbcnpf.utils.$registeredPlayerPrevFrame)
    {
        for (var f in bbcnpf.utils.$registeredOnFrameCallbacks)
        {
            setTimeout(bbcnpf.utils.$registeredOnFrameCallbacks[f]({
                "seconds": bbcnpf.utils.$registeredPlayer.currentTime,
                "frames": bbcnpf.utils.$registeredPlayerCurrentFrame,
                "timecode": bbcnpf.utils.seconds2timecode(bbcnpf.utils.$registeredPlayer.currentTime),
            }), 0)
        }
        bbcnpf.utils.$registeredPlayerPrevFrame=bbcnpf.utils.$registeredPlayerCurrentFrame
    }
}

bbcnpf.utils.playerPlaying=function()
{
    if (bbcnpf.utils.$registeredPlayer.paused || bbcnpf.utils.$registeredPlayer.ended)
    {
        bbcnpf.utils.$registeredPlayerCurrentFrame=bbcnpf.utils.seconds2frames(bbcnpf.utils.$registeredPlayer.currentTime)
        bbcnpf.utils.$registeredPlayerPrevFrame=bbcnpf.utils.$registeredPlayerCurrentFrame
    } else {
        bbcnpf.utils.playerUpdateFrame()
        requestAnimationFrame(bbcnpf.utils.playerPlaying)
    }
}

bbcnpf.utils.fGetViewport=function()
{
    var wid, hei
    if(typeof(window.innerWidth)!='undefined')
    {
        wid=window.innerWidth
        hei=window.innerHeight
    }
    else if(typeof(document.documentElement)!='undefined' && typeof(document.documentElement.clientWidth)!=0)
    {
        wid=document.documentElement.clientWidth
        hei=document.documentElement.clientHeight
    }
    return [wid, hei]
}

bbcnpf.utils.formatJupiterDate=function(datein)
{
    // convert Jupiter Date (GMT/UNC) to locale (could be BST or EST/EDT)
    var nd=new Date()
    var today=nd.bbcnpf_jupiterdate().substring(0,10)

    var a=datein.split(' ')
    var d=a[0].split('-')
    var t=a[1].split(':')

    nd.setUTCFullYear(d[0], d[1]-1, d[2])
    nd.setUTCHours(t[0], t[1], t[2], 0)

    return nd.bbcnpf_jupiterdate().replace(today, '<b>Today</b>') // yyyy-mm-dd hh:mm:ss
}

bbcnpf.utils.frames2timecode=function(frames, fps)
{
    if (typeof(fps)=='undefined') var fps=bbcnpf.utils.$FPS
    var sec=bbcnpf.utils.frames2seconds(frames, fps)
    return bbcnpf.utils.seconds2timecode(sec, fps)
}

bbcnpf.utils.normalisePlayertime=function(seconds, fps)
{
    if (typeof(fps)=='undefined') var fps=bbcnpf.utils.$FPS
    return Number((1.0/fps*Math.floor(Number((fps*seconds).toPrecision(12)))).toFixed(2))
}

bbcnpf.utils.seconds2frames=function(seconds, fps)
{
    if (typeof(fps)=='undefined') var fps=bbcnpf.utils.$FPS
    return parseInt(bbcnpf.utils.normalisePlayertime(seconds, fps) * fps)
}

bbcnpf.utils.frames2seconds=function(frames, fps)
{
    if (typeof(fps)=='undefined') var fps=bbcnpf.utils.$FPS
    return Number((frames/fps).toFixed(2))
}

bbcnpf.utils.seconds2timecode=function(seconds, fps)
{
    // written for PAL non-drop timecode
    if (typeof(fps)=='undefined') var fps=bbcnpf.utils.$FPS
	var ns=bbcnpf.utils.normalisePlayertime(seconds, fps)
    var wsec=Math.floor(ns)
    var f=((ns-wsec)*fps).toFixed(2)

    function _n2(n)
    {
        if(n<10)return '0'+parseInt(n)
        else return parseInt(n)
    }

    return _n2((wsec/60/60)%60)
        + ':'
        + _n2((wsec/60)%60)
        + ':'
        + _n2(wsec%60)
        + ':'
        + _n2(f)
}

bbcnpf.utils.pad=function(input, width, padchar)
{
    padchar=padchar || '0'
    input=input+''
    return input.length > width ? input : new Array(width-input.length+1).join(padchar)+input
}

bbcnpf.utils.seconds2keyframename=function(seconds, fps)
{
    if (typeof(fps)=='undefined') var fps=bbcnpf.utils.$FPS
    return bbcnpf.utils.pad(bbcnpf.utils.seconds2frames(seconds, fps), 8) + '.jpg'
}

bbcnpf.utils.oneLine=function(str)
{
    return str.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
}

bbcnpf.utils.timecode2frames=function(tc, fps)
{
    // TODO make 29.97 fps drop-frame aware - works for 25 only.
    if (typeof(fps)=='undefined') var fps=bbcnpf.utils.$FPS
    var s=tc.split(':')
    var frames=parseInt(s[3])
    frames += parseInt(s[2]) * fps
    frames += parseInt(s[1]) * (fps*60)
    frames += parseInt(s[0]) * (fps*60*60)
    return frames
}

bbcnpf.utils.timecode2seconds=function(tc, fps)
{
    if (typeof(fps)=='undefined') var fps=bbcnpf.utils.$FPS
    var f=bbcnpf.utils.timecode2frames(tc, fps)
    return Number(f/fps).toFixed(2)
}

bbcnpf.utils.mmss2seconds=function(mmss)
{
    var x=mmss.split(':')
    return parseInt(x[0])*60 + parseInt(x[1])
}

bbcnpf.utils.seconds2mmss=function(seconds)
{
    var s=parseInt(seconds)
    var rs=s%60;
    var m=(s-rs)/60
    return bbcnpf.utils.pad(m,2) + ':' + bbcnpf.utils.pad(rs,2)
}
