importScripts("./fmtlist.js");

function get_fmt_from_ver(ver)
{
    if (fmts_ft.includes(ver))
    {
        return 'ft';
    }

    if (fmts_dt2.includes(ver))
    {
        return 'dt2';
    }
    
    return -1;
}