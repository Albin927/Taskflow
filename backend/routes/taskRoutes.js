const express = require("express");
const pool = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE TASK
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { title, description, priority } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        const result = await pool.query(
            `INSERT INTO tasks (title, description, priority, user_id)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [
                title,
                description || null,
                priority || "MEDIUM",
                req.user.id
            ]
        );

        res.status(201).json({
            message: "Task created successfully",
            task: result.rows[0]
        });

    } catch (error) {
        console.error("Create task error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// GET ALL USER TASKS
router.get("/", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM tasks
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [req.user.id]
        );

        res.json({
            tasks: result.rows
        });

    } catch (error) {
        console.error("Get tasks error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// UPDATE TASK
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, status } = req.body;

        const result = await pool.query(
            `UPDATE tasks
             SET title = COALESCE($1, title),
                 description = COALESCE($2, description),
                 priority = COALESCE($3, priority),
                 status = COALESCE($4, status)
             WHERE id = $5 AND user_id = $6
             RETURNING *`,
            [
                title,
                description,
                priority,
                status,
                id,
                req.user.id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task updated successfully",
            task: result.rows[0]
        });

    } catch (error) {
        console.error("Update task error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// DELETE TASK
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM tasks
             WHERE id = $1 AND user_id = $2
             RETURNING *`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        console.error("Delete task error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;