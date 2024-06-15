from odoo import models, fields, api, _

class ProjectProject(models.Model):
    _inherit = 'project.project'

    prj_num = fields.Char(string=_('Project Number'), required=True)
    project_type = fields.Selection(
        [('infrastructure', _('Infrastructure')),
         ('building', _('Building')),
         ('road', _('Road')), ], string=_('Project Type'),
        required=True)
    budget = fields.Float(string=_('Budget'), required=True)
    progress = fields.Float(string=_('Progress'), compute='_compute_progress')
    quality_status = fields.Selection([
        ('good', _('Good')),
        ('average', _('Average')),
        ('poor', _('Poor')), ], string=_('Quality Status'), default='good')
    plan_ids = fields.One2many('project.plan', 'project_id', string=_('Plans'))
    cost_ids = fields.One2many('project.cost', 'project_id', string=_('Costs'))
    quality_ids = fields.One2many('project.quality', 'project_id', string=_('Quality Checks'))
    safety_ids = fields.One2many('project.safety', 'project_id', string=_('Safety Checks'))
    risk_ids = fields.One2many('project.risk', 'project_id', string=_('Risks'))

    @api.model
    def create(self, vals):
        # 在这里可以添加任何需要在创建记录时执行的逻辑
        return super(ProjectProject, self).create(vals)

    def write(self, vals):
        # 在这里可以添加任何需要在更新记录时执行的逻辑
        return super(ProjectProject, self).write(vals)

    @api.depends('task.ids')
    def _compute_custom_metrics(self):
        for project in self:
            # Implement custom logic to calculate and update custom metrics
            project.progress = sum(task.progress for task in project.task_ids) / len(project.task_ids) if project.task_ids else 0

    @api.depends('tasks')
    def _compute_progress(self):
        for project in self:
            total_tasks = len(project.tasks)
            completed_tasks = len(project.tasks.filtered(lambda t: t.stage_id.fold))
            project.progress = (completed_tasks / total_tasks) * 100 if total_tasks > 0 else 0

class ProjectTask(models.Model):
    _inherit = 'project.task'

    project_type = fields.Selection(related='project_id.project_type', store=True)
    quality_issues = fields.Text(string=_('Quality Issues'))
