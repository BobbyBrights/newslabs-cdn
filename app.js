var bbc=bbc||{}
bbc.newslabs=bbc.newslabs||{}

// build a standard header, based on meta tags
bbc.newslabs.fHeader=function()
{
    var h='<div class=container>'
        + '<span class=title>' + this.fGetMeta('app') + '</span>:: &nbsp;A BBC News Labs prototype'
        + '<span id=whoami><a class=fakea style=color:white onclick=bbc.newslabs.fLogin()>Login</a></span>'
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
    var h='<div class=container>'
        + '<img class=labslogo src="https://bbc.github.io/newslabs-cdn/newslabs-logo.svg">'
        + '<img class=teamlogo title="' + this.fGetMeta('author') + '" src="' + this.fGetMeta('teamlogo') + '">'
        + '<img class=bbclogo src="https://bbc.github.io/newslabs-cdn/bbc-blocks-dark.png">'
        + ' This is a <a target="_blank" href="http://bbcnewslabs.co.uk/">BBC News Labs</a> prototype.'
        + ' If you have any comments or suggested improvements for this prototype, want to report a problem or have a brilliant idea, please do '
        + '<a href="mailto:newslabs-development@lists.forge.bbc.co.uk?subject=' + this.fGetMeta('app') + '+product+feedback">drop us a line</a> and we will reply as soon as we can.'
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
    this.fImport('https://bbc.github.io/newslabs-cdn/fonts/' + name.toLowerCase() + '/font.css')
}

// inject these standard dependencies
bbc.newslabs.fImport("https://code.jquery.com/jquery-2.2.4.min.js")
bbc.newslabs.fImport("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js")
bbc.newslabs.fImport("https://bbc.github.io/newslabs-cdn/bbcnpf.utils.js")

bbc.newslabs.fAddFile("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css")
bbc.newslabs.fAddFile("https://bbc.github.io/newslabs-cdn/app.css")

// defined alias
_import=bbc.newslabs.fImport

// insert (and/or populate) header and footer elements when the page is ready
document.addEventListener('DOMContentLoaded', function() {
    bbc.newslabs.fHeader()
    bbc.newslabs.fFooter()
})

// include a standard local this.js script
bbc.newslabs.fImport("this.js")
