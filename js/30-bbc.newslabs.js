
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

    // require bowser
    require(['bowser'], function(bowser){
        if (bowser.mobile || bowser.tablet) {
            document.title=bbc.newslabs.fGetMeta('app')
        } else {
            document.title=bbc.newslabs.fGetMeta('app') + ' :: A BBC News Labs prototype'
        }
    })
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
        this.$meta.version=_findtag(tags, 'application-version', '1.0.0')
        this.$meta.author=_findtag(tags, 'author')
        this.$meta.teamlogo=_findtag(tags, 'teamlogo')
        this.$meta.generator=_findtag(tags, 'generator')
        this.$meta.echosite=_findtag(tags, 'echo-site', 'news')
    }

    return this.$meta[tagname]

    function _findtag(tags, tag, default_value)
    {
        if (typeof(tags[tag])!=='undefined')
        {
            return tags[tag].getAttribute('content')
        }
        else if (typeof(default_value)!=='undefined')
        {
            return default_value
        }
        else
        {
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
    //e.content='width=device-width,initial-scale=1.0'
    e.content='initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,width=device-width,user-scalable=no'
    void(document.getElementsByTagName('head')[0].appendChild(e))
}

// ensure the page had a apple-web-app meta
if (!document.getElementsByTagName('meta')["apple-mobile-web-app-capable"])
{
    var e=document.createElement('meta')
    e.name='apple-mobile-web-app-capable'
    e.content='yes'
    void(document.getElementsByTagName('head')[0].appendChild(e))
}

// general dependences

// the Reith fonts
bbc.newslabs.fAddFile("https://bbc.github.io/newslabs-cdn/fonts/reith/font.css")

// a css bundle, includes bootstrap
bbc.newslabs.fAddFile("https://bbc.github.io/newslabs-cdn/app.css")

// defined alias
_import=bbc.newslabs.fImport

// insert (and/or populate) header and footer elements when the page is ready
document.addEventListener('DOMContentLoaded', function() {
    bbc.newslabs.fOnCDNReady()
})

// what to do when the CDN (i.e. this script) is ready to go
bbc.newslabs.fOnCDNReady=function() {
    bbc.newslabs.fHeader()
    bbc.newslabs.fFooter()
}

// Setup common dependencies via requirejs - SMP and VUE. Others may follow.
require({
    paths: {
        "jquery-1.9": "http://static.bbci.co.uk/frameworks/jquery/0.3.0/sharedmodules/jquery-1.9.1",
        "bump-3": "http://emp.bbci.co.uk/emp/bump-3/bump-3",
        "vuedev": "https://cdn.jsdelivr.net/npm/vue@2.5.13/dist/vue",
        "vue": "https://cdn.jsdelivr.net/npm/vue@2.5.13/dist/vue.min",
        "vuerouter": "https://cdn.jsdelivr.net/npm/vue-router@3.0.1/dist/vue-router.min",
        "vuex": "https://cdn.jsdelivr.net/npm/vuex@3.0.1/dist/vuex.common.min",
        "hammerjs": "https://cdn.jsdelivr.net/npm/hammerjs@2.0.8/hammer.min",
        "jqueryhammer": "https://cdn.jsdelivr.net/npm/jquery-hammerjs@2.0.0/jquery.hammer.min",
        "vuehammer": "https://cdn.jsdelivr.net/npm/vue-hammer@0.2.0/index.min",
        "echo": "https://mybbc-analytics.files.bbci.co.uk/echo-client-js/echo-11.0.2.min",
    },
    waitSeconds: 30
})

// init the BBC's echo (DAX) library
require(['echo'], function(echo){
    var appname='newslabs-'+bbc.newslabs.fGetMeta('app').toLowerCase()
    bbc.newslabs.echo={
        lib: echo,
        client: new echo.EchoClient(
            appname,
            echo.Enums.ApplicationType.MOBILE_WEB
        )
    }

    var e=bbc.newslabs.echo
    e.$pagename=appname.replace('-', '.')+'.page'
    e.view=function(o) {
        bbc.Jlog({
            echo: 'viewEvent',
            page: this.$pagename,
            arg: o,
        })
        this.client.viewEvent(this.$pagename, o)
    }

    var ec=e.client
    ec.addLabel('name', e.$pagename)
    ec.addLabel('ml_name', 'echo')
    ec.addLabel('ml_version', '11.0.2')
    ec.addLabel('bbc_site', bbc.newslabs.$meta.echosite)
    ec.setAppVersion(bbc.newslabs.$meta.version)
 
    // and register our page load
    bbc.newslabs.echo.view({action_name: 'ready'})
})


// include a standard local this.js script
require(['this'])
