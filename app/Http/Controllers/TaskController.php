<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Category;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(){
        return Task::with('category')->paginate(5);
    }

    public function store(CreateTaskRequest $request){
        $task = Task::create([
            'title' => $request->title,
            'body' => $request->body,
            'category_id' => $request->category_id
        ]);
        return $task;
    }

    public function show(Task $task){
        return $task;
    }

    public function update(UpdateTaskRequest $request, Task $task){
        $task->update([
            'title' => $request->title,
            'body' => $request->body,
            'category_id' => $request->category_id,
            'done' => $request->done
        ]);
        return $task;
    }

    public function destroy(Task $task){
        $task->delete();
        return ['message'=>"Your Task has been removed."];
    }

    public function getTaskByCategory(Category $category){
        return $category->tasks()->with('category')->paginate(2);
    }

    public function getTasksOrderBy($column, $direction){
        return Task::with('category')->orderBy($column, $direction)->paginate(10);
    }

    public function getTasksByTerm($term){
        return Task::with('category')
            ->where('title', 'like', '%'.$term.'%')
            ->orWhere('body', 'like', '%'.$term.'%')
            ->orWhere('id', 'like', '%'.$term.'%')
            ->paginate(10);
    }
}
