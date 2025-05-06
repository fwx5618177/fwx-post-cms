import React, { useState } from "react";
import styles from "@styles/pages/todo.module.scss";
import { FaPlus, FaRegCircle, FaCheckCircle, FaLink, FaCalendarAlt } from "react-icons/fa";

interface Task {
    id: number;
    text: string;
    completed: boolean;
    dueDate?: string;
    linkCount?: string;
    subTask?: { done: number; total: number };
}

interface Group {
    id: string;
    name: string;
    tasks: Task[];
}

const initialGroups: Group[] = [
    {
        id: "holiday",
        name: "清明假期",
        tasks: [
            { id: 1, text: "射频渲染", completed: false },
            { id: 2, text: "支付平台", completed: false },
            { id: 3, text: "游戏", completed: false },
            { id: 4, text: "toB 系统", completed: false },
            { id: 5, text: "在线简历", completed: false, linkCount: "0/1" },
            { id: 6, text: "博客系统", completed: false, linkCount: "0/4" },
            { id: 7, text: "自建 CI/CD 平台", completed: false, linkCount: "0/2" },
        ],
    },
    {
        id: "today",
        name: "今日",
        tasks: [
            { id: 8, text: "车子-智能学习", completed: false },
            { id: 9, text: "合约-部署", completed: false },
            { id: 10, text: "报销", completed: false },
            { id: 11, text: "皮肤科-毛囊炎", completed: false, dueDate: "4月30日" },
            { id: 12, text: "文档-coze的调试", completed: false },
        ],
    },
];

const TodoListFlow = () => {
    const [groups, setGroups] = useState<Group[]>(initialGroups);
    const [adding, setAdding] = useState<{ groupId: string; show: boolean }>({ groupId: "", show: false });
    const [input, setInput] = useState("");

    const handleToggle = (groupId: string, taskId: number) => {
        setGroups(gs =>
            gs.map(g =>
                g.id === groupId
                    ? {
                          ...g,
                          tasks: g.tasks.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
                      }
                    : g,
            ),
        );
    };

    const handleAddClick = (groupId: string) => {
        setAdding({ groupId, show: true });
        setInput("");
    };

    const handleAddTask = (groupId: string) => {
        const text = input.trim();
        if (!text) return;
        setGroups(gs =>
            gs.map(g =>
                g.id === groupId
                    ? {
                          ...g,
                          tasks: [...g.tasks, { id: Date.now(), text, completed: false }],
                      }
                    : g,
            ),
        );
        setAdding({ groupId: "", show: false });
        setInput("");
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, groupId: string) => {
        if (e.key === "Enter") handleAddTask(groupId);
        if (e.key === "Escape") {
            setAdding({ groupId: "", show: false });
            setInput("");
        }
    };

    return (
        <div className={styles.flowPage}>
            <div className={styles.flowGroups}>
                {groups.map(group => (
                    <div className={styles.flowGroup} key={group.id}>
                        <div className={styles.groupHeader}>
                            <span className={styles.groupName}>{group.name}</span>
                            <span className={styles.groupCount}>{group.tasks.length}</span>
                        </div>
                        <ul className={styles.taskList}>
                            {group.tasks.map(task => (
                                <li className={styles.taskRow} key={task.id}>
                                    <span className={styles.checkIcon} onClick={() => handleToggle(group.id, task.id)}>
                                        {task.completed ? <FaCheckCircle /> : <FaRegCircle />}
                                    </span>
                                    <span className={styles.taskText}>{task.text}</span>
                                    {task.linkCount && (
                                        <span className={styles.taskMeta}>
                                            <FaLink />
                                            {task.linkCount}
                                        </span>
                                    )}
                                    {task.dueDate && (
                                        <span className={styles.taskMeta} style={{ color: "#ef4444" }}>
                                            <FaCalendarAlt style={{ marginRight: 2 }} />
                                            {task.dueDate}
                                        </span>
                                    )}
                                    {task.subTask && (
                                        <span className={styles.taskMeta}>
                                            {task.subTask.done}/{task.subTask.total}
                                        </span>
                                    )}
                                </li>
                            ))}
                            <li className={styles.addRow}>
                                {adding.show && adding.groupId === group.id ? (
                                    <input
                                        className={styles.addInput}
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onBlur={() => setAdding({ groupId: "", show: false })}
                                        onKeyDown={e => handleInputKeyDown(e, group.id)}
                                        autoFocus
                                        placeholder="输入任务内容..."
                                    />
                                ) : (
                                    <span className={styles.addBtn} onClick={() => handleAddClick(group.id)}>
                                        <FaPlus /> 添加任务
                                    </span>
                                )}
                            </li>
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoListFlow;
