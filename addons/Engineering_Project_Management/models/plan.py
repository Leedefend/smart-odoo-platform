from odoo import models, fields, _

class ProjectPlan(models.Model):
    _name = 'project.plan'
    _description = 'Project Plan'

    name = fields.Char(string=_('Plan Name'), required=True)
    project_id = fields.Many2one('project.project', string=_('Project'), required=True)
    plan_type = fields.Selection([
        ('milestone', _('Milestone Plan')),
        ('main', _('Main Plan')),
        ('special', _('Special Plan')),
    ], string=_('Plan Type'), required=True)
    start_date = fields.Date(string=_('Start Date'))
    end_date = fields.Date(string=_('End Date'))
    status = fields.Selection([
        ('draft', _('Draft')),
        ('approved', _('Approved')),
        ('rejected', _('Rejected')),
    ], string=_('Status'), default='draft')
