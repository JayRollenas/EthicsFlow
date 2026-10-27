<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UploadManager extends Controller
{
    //
    function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:pdf|max:2048',
        ]);

        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        $file->move(public_path('uploads'), $filename);

        return response()->json(['success' => true, 'filename' => $filename]);
    }
}
