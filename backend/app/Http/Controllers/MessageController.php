<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use App\Events\MessageSent;

class MessageController extends Controller
{
  public function index() {
    $messages = Message::orderBy('created_at', 'asc')->get();
    return response()->json($messages);
  }
  
  public function store(Request $req) {
    $req->validate([
      'username' => 'required|string|max:255',
      'content' => 'required|string'
    ]);
    
    $message = Message::create([
      'username' => $req->username,
      'content' => $req->content
    ]);
    
    broadcast(new MessageSent($message))->toOthers();
    
    return response()->json($message, 201);
  }
  
  public function store(Request $req) {
    \Log::info('Recebendo POST:', $req->all());
  }
}
