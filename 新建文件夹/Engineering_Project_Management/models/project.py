from odoo import models, fields, api, _


class ProjectProject(models.Model):
    _inherit = 'project.project'

    # project_group_id = fields.Many2one('project.group', string='Project Group')
    prj_num = fields.Char(string=_('项目编号'), required=True, readonly=True, default=lambda self: _('New'))
    name = fields.Char(string=_('项目名称'))
    construction_location = fields.Char(string=_('建设位置'))
    construction_content = fields.Text(string=_('建设内容及规模'))
    project_management_company_id = fields.Many2one('res.company', string=_('项目管理公司'))
    segment_num = fields.Char(string=_('标段编号'))
    segment_name = fields.Char(string=_('标段名称'))
    project_nature = fields.Selection(
        [('new', _('新建')),
         ('rebuild', _('改建')),
         ('extension', _('扩建'))], string=_('项目性质'),
        required=True)
    annual_target = fields.Char(string=_('年度目标'))
    partner_ids = fields.One2many('project.partner', 'project_id', string="参建单位")

    def create_tasks_from_templates(self):
        for stage in self.env['project.project.stage'].search([]):
            for task_template in stage.task_template_ids:
                self.env['project.task'].create({
                    'name': task_template.name,
                    'project_id': self.id,
                    'project_stage_id': stage.id,
                    'description': task_template.description,
                    'sequence': task_template.sequence,
                    'template_id': task_template.id,
                })

    @api.model
    def create(self, vals):
        if vals.get('prj_num', _('New')) == _('New'):
            vals['prj_num'] = self.env['ir.sequence'].next_by_code('project.project') or _('New')
            # 调用父类的 create 方法
        project = super(ProjectProject, self).create(vals)

        # 在创建项目后生成任务
        project.create_tasks_from_templates()

        return project
