/*
  DSC Studio
  Copyright (C) 2022-2024 nastys

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation, either version 3 of the
  License, or (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
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

    if (fmts_pd1.includes(ver))
    {
        return 'pd1';
    }

    if (fmts_pd2.includes(ver))
    {
        return 'pd2';
    }
    
    return -1;
}