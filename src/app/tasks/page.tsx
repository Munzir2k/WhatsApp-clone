/** @format */
"use client";
import { useMutation, useQuery } from "convex/react";
import React from "react";
import { api } from "../../../convex/_generated/api";

const TaskPage = () => {
    const tasks = useQuery(api.tasks.getTasks);
    const deleteTask = useMutation(api.tasks.deleteTask);
    return (
        <div className="p-10 flex flex-col gap-4">
            <div className="text-5xl">All tasks are here</div>
            {tasks?.map((task) => (
                <div className="flex gap-2" key={task._id}>
                    <span>{task.text}</span>
                    <button
                        onClick={() => deleteTask({ id: task._id })}
                        className="text-red-500"
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
};

export default TaskPage;
