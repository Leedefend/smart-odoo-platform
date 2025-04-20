from odoo import models, fields, api

class ProjectTask(models.Model):
    _inherit = 'project.task'

    template_id = fields.Many2one('project.task.template', string="任务模板")
    is_template = fields.Boolean(string="是否为模板", default=False)
    stage_id = fields.Many2one('project.task.type', string="任务阶段")
    project_stage_id = fields.Many2one('project.project.stage', string="项目阶段")
    progress = fields.Float(string="进度", default=0.0)
    report = fields.Text(string="汇报")
    dependent_task_ids = fields.Many2many('project.task', 'task_dependency_rel', 'task_id', 'dependent_task_id', string="依赖任务")
    department_id = fields.Many2one('hr.department', string='责任部门')
    responsible_user_id = fields.Many2one('res.users', string='责任人')
    @api.model
    def create(self, vals):
        if vals.get('is_template'):
            # 处理模板创建逻辑
           pass
        return super(ProjectTask, self).create(vals)

    def create_tasks_from_template(self, vals):
        template_id = vals.get('template_id')
        if template_id:
            template = self.env['project.task.template'].browse(template_id)
            for task_vals in template.task_ids:
                task_vals.update({
                    'project_id': vals.get('project_id'),
                    'project_stage_id': vals.get('project_stage_id'),
                    'stage_id': template.stage_id.id or vals.get('stage_id'),  # 设置任务阶段
                })
                self.env['project.task'].create(task_vals)
class ProjectTaskType(models.Model):
    _inherit = 'project.task.type'

    # 添加一个布尔字段来标识这个任务类型是否从模板创建
    is_template = fields.Boolean(string="Created from Template", default=False)
