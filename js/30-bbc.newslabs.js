
/*
 * News Labs general function
 *
 */
var bbc=bbc||{}
bbc.newslabs=bbc.newslabs||{}

// build a standard header, based on meta tags
bbc.newslabs.fHeader=function()
{
    var h='<div class="container ReithSans-normal-normal">'
        + '<span style="margin-right:1rem;font-weight:bold;">' + this.fGetMeta('app') + '</span>:: &nbsp;A BBC News Labs prototype'
        + '<span style="float:right;" id="whoami"><a class="fakea" style="color:white;" onclick="bbc.newslabs.fLogin()">Login</a></span>'
        + '</div>'

    var headers=document.getElementsByTagName('header')
        
    if (headers.length>0)
    {
        headers[0].innerHTML=h
    } else {
        var e=document.createElement('header')
        e.innerHTML=h
        var b=document.getElementsByTagName('body')[0]
        b.insertBefore(e, b.firstChild)
    }

    document.title=this.fGetMeta('app') + ' :: A BBC News Labs prototype'
}

bbc.newslabs.fLogin=function(retval)
{
    if (typeof(retval)=='undefined')
    {
        bbc.newslabs.fAddFile("https://insight.newslabs.co/bbc.userinfo/?callback=bbc.newslabs.fLogin&type=.js")
    } else {
        bbc.userinfo=retval
        $('#whoami').html(bbc.userinfo.mail).attr('title',bbc.userinfo.displayname)

        // is a generic in-app function defined
        if (typeof(fOnLogin)!=='undefined') fOnLogin()
    }
}

// build a standard footer, based on meta tags
bbc.newslabs.fFooter=function()
{
    var tl=this.fGetMeta('teamlogo')

    var h='<div class="container ReithSans-normal-normal"><img style="float:left;height:50px;margin-right:1rem;" src="https://bbc.github.io/newslabs-cdn/newslabs-logo.svg">'

    if (tl.length>0) {
        h+='<img style="float:right;height:50px;margin-left:1rem;" title="' + this.fGetMeta('author') + '" src="' + tl + '">'
    }

    h+='<img style="height:1.5rem;margin:0 0.5rem 0.5rem 0;" class=bbclogo src="https://bbc.github.io/newslabs-cdn/bbc-blocks-dark.png">'
        + ' This is a <a target="_blank" href="http://bbcnewslabs.co.uk/">BBC News Labs</a> prototype.'
        + ' <a target=_blank href=http://newslabs.tools.bbc.co.uk>Find out what else we\'re working on.</a>'
        + '<br>For support, suggestions or feedback, '
        + '<a href="mailto:newslabs-development@lists.forge.bbc.co.uk?subject=' + this.fGetMeta('app') + '+product+feedback">get in touch!</a>'
        + '</div>'

    var footers=document.getElementsByTagName('footer')

    if (footers.length>0)
    {
        footers[0].innerHTML=h
    } else {
        var e=document.createElement('footer')
        e.innerHTML=h
        document.getElementsByTagName('body')[0].appendChild(e)
    }
}

bbc.newslabs.fGetMeta=function(tagname)
{
    if (typeof(this.$meta)=='undefined')
    {
        var tags=document.getElementsByTagName('meta')
        this.$meta=this.$meta||{}

        this.$meta.app=_findtag(tags, 'application-name')
        this.$meta.author=_findtag(tags, 'author')
        this.$meta.teamlogo=_findtag(tags, 'teamlogo')
        this.$meta.generator=_findtag(tags, 'generator')
    }

    return this.$meta[tagname]

    function _findtag(tags, tag)
    {
        if (typeof(tags[tag])!=='undefined')
        {
            return tags[tag].getAttribute('content')
        } else {
            return ''
        }
    }
}

bbc.newslabs.fAddFile=function(ref)
{
    var t=ref.split('.').reverse()[0].toLowerCase()

    if (t=='css')
    {
        var list=document.getElementsByTagName('link')
        var prop='href'
    } else if (t=='js') {
        var list=document.getElementsByTagName('script')
        var prop='src'
    }

    for (var i=0, found=false; i<list.length; i++)
    {
        if (list[i][prop]==ref)
        {
            found=true
            break
        }
    }

    if (!found)
    {
        if (t=='css')
        {
            var e=document.createElement('link')
            e.rel='stylesheet'
            e.type='text/css'
            e.href=ref
            void(document.getElementsByTagName('head')[0].appendChild(e))
        } else if (t=='js') {
            var e=document.createElement('script')
            e.language='javascript'
            e.type='text/javascript'
            e.src=ref
            void(document.getElementsByTagName('head')[0].appendChild(e))
        }
    }

}

bbc.newslabs.fImport=function(ref)
{
    var t=ref.split('.').reverse()[0].toLowerCase()
    if (t=='js')
    {
        document.write('<script src="'+ref+'"></script>')
    }
    if (t=='css')
    {
        document.write('<link rel="stylesheet" href="'+ref+'"/>')
    }
}

// helper to add a font
bbc.newslabs.addFont=function(name)
{
    this.fAddFile('https://bbc.github.io/newslabs-cdn/fonts/' + name.toLowerCase() + '/font.css')
}

// ensure the page had a viewport meta
if (!document.getElementsByTagName('meta')["viewport"])
{
    var e=document.createElement('meta')
    e.name='viewport'
    e.content='width=device-width,initial-scale=1.0'
    void(document.getElementsByTagName('head')[0].appendChild(e))
}

// general dependences

// the Reith fonts
bbc.newslabs.fAddFile("https://bbc.github.io/newslabs-cdn/fonts/reith/font.css")

// a css bundle, includes bootstrap
bbc.newslabs.fAddFile("https://bbc.github.io/newslabs-cdn/app.css")

// check that requirejs has been injected in the defining document. alert if not and suggest a remedy.
// it is required for SMP to embed correctly.
var haveRequire=false
document.querySelectorAll('script').forEach(function(script){
    if(script.src.indexOf('/require.js')>-1)haveRequire=true
})
if(!haveRequire){
    console.error(`For SMP or VUE to work correctly, you MUST include the following in the head of your page, BEFORE the newslabs-cdn/app.js script tag:
<script src=http://static.bbci.co.uk/frameworks/requirejs/0.13.0/sharedmodules/require.js></script>`)
}

// defined alias
_import=bbc.newslabs.fImport

// insert (and/or populate) header and footer elements when the page is ready
document.addEventListener('DOMContentLoaded', function() {
    bbc.newslabs.fHeader()
    bbc.newslabs.fFooter()
})

// Setup common dependencies via requirejs - SMP and VUE. Others may follow.
if(typeof(require)=="function") {
    require({
        paths: {
            "jquery-1.9": "http://static.bbci.co.uk/frameworks/jquery/0.3.0/sharedmodules/jquery-1.9.1",
            "bump-3": "http://emp.bbci.co.uk/emp/bump-3/bump-3",
            "vuedev": "https://vuejs.org/js/vue",
            "vue": "https://cdn.jsdelivr.net/npm/vue@2.5.13/dist/vue"
        },
        waitSeconds: 30
    })
} else {
    console.error('WARNING: The require module is not installed - unable to import SMP or VUE!')
}

// include a standard local this.js script
bbc.newslabs.fImport("this.js")
