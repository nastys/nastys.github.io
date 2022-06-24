var fmts_ft=[353510679,285614104,335874337,369295649,352458520,335745816,335618838,319956249,319296802,318845217]
var fmts_dt2=[302121504,285419544,285349657]

function set_fmt_ver(ver)
{
    document.getElementById('dscver').value = ver;
    const fmt = document.getElementById('dscfmt');

    if (fmts_ft.includes(ver))
    {
        fmt.value = 'ft';
        return true;
    }

    if (fmts_dt2.includes(ver))
    {
        fmt.value = 'dt2';
        return true;
    }
    
    return false;
}